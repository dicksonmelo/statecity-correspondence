import { promises as fs } from "fs"

async function readAndCreate() {
    try {

        const states = JSON.parse(await fs.readFile('estados.json'))
        const cities = JSON.parse(await fs.readFile('cidades.json'))

        states.forEach(state => {
            let i = state.ID
            let filteredCities = cities.filter(city => city.Estado == i)
            fs.writeFile(state.Sigla + '.json', JSON.stringify(filteredCities))
        });
        

    } catch (err) {
        console.log(err)
    }
}

readAndCreate()