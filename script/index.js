import { promises as fs } from "fs"

// Criando um arquivo JSON para todos os estados. Failed: não consegui criar a pasta.

async function readAndCreate() {
    try {

        const states = JSON.parse(await fs.readFile('estados.json'))
        const cities = JSON.parse(await fs.readFile('cidades.json'))

        states.forEach(state => {
            let i = state.ID
            let filteredCities = cities.filter(city => city.Estado == i)
            fs.writeFile('./states/' + `${state.Sigla}.json`, JSON.stringify(filteredCities))
            
        })
        
    } catch (err) {
        console.log(err)
    }
}

readAndCreate()