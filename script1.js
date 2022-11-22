document.querySelector("#btnSearch").addEventListener("click",()=>{
    let txt=document.querySelector("#txtSearch").value
    document.querySelector("#details").style.opacity=0;
    getCountry(txt)
})

const getCountry=(country)=>{
    fetch("https://restcountries.com/v3.1/name/"+country)
        .then((response)=>{
            // if(response.status==404){}//bu şekilde de olur
            if(!response.ok){//response içinde ok key'i var
                throw new Error("Ülke Bulunamadı")//throw=> hata oluşturuyoruz
            }
            return response.json()
        })
        .then((data)=>{
            renderCountry(data[0])
            
            const countries=data[0].borders
            if(!countries){
                throw new Error("Komşu Ülke Bulunamadı")
            }
            
            return fetch("https://restcountries.com/v3.1/alpha?codes="+countries.toString())
        })
        .then(response=>{
            return response.json()
        })
        .then((data)=>{
            renderNeighbors(data)
        }).catch(err=>renderError(err))


}

const renderCountry=(data)=>{
    document.querySelector("#country-details").innerHTML=""
    document.querySelector("#neighbors").innerHTML=""
    
    let html=`
                    <div class="col-4">
                        <img src="${data.flags.png}">
                    </div>
                    <div class="col-8">
                        <h3 class="card-title">${data.name.common}</h3>
                        <hr>
                        <div class="row">
                            <div class="col-4">Nüfus:</div>
                            <div class="col-8">${(data.population/1000000).toFixed(1)}</div>
                        </div>
                        <div class="row">
                            <div class="col-4">Resmi Dil:</div>
                            <div class="col-8">${Object.values(data.languages)}</div>
                        </div>
                        <div class="row">
                            <div class="col-4">Başkent:</div>
                            <div class="col-8">${data.capital}</div>
                        </div>
                        <div class="row">
                            <div class="col-4">Para Birimi:</div>
                            <div class="col-8">${Object.values(data.currencies)[0].name} (${Object.values(data.currencies)[0].symbol})</div>
                        </div>
                    </div>
              `

        document.querySelector("#details").style.opacity=1
        document.querySelector("#country-details").innerHTML=html
    
}

const renderNeighbors=(data)=>{
    let html="";
    for(let country of data){
        html+=`
        <div class="col-2 mt-2 as">
            <div class="card">
                <img src="${country.flags.png}" class="card-img-top">
                <div class="card-body">
                    <h6 class="card-title">${country.name.common}</div>
                </div>
            </div>
        </div>`
        
        document.querySelector("#neighbors").innerHTML=html
    }
    console.log(html)
}

const renderError=(err)=>{
    const html=`
    <div class="alert alert-danger">
        ${err.message}
    </div>`
    setTimeout(()=>{
        document.querySelector("#errors").innerHTML=""
    },3000)
    
    document.querySelector("#errors").innerHTML=html
}