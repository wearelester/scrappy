async function searchTools() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p>Buscando...</p>';

    try {
        // Search for tools on "There's an AI for That"
        const aiForThatResults = await fetch(`https://theresanaiforthat.com/api/search?q=${query}&lang=es`);
        const aiData = await aiForThatResults.json();

        // Search for tools on Product Hunt (replace `API_KEY` with your own)
        const productHuntResults = await fetch(`https://api.producthunt.com/v2/api/graphql`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer YOUR_API_KEY`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    {
                        posts(search: "${query}", language: "es") {
                            edges {
                                node {
                                    name
                                    description
                                    url
                                }
                            }
                        }
                    }
                `
            })
        });
        const productHuntData = await productHuntResults.json();

        // Display Results
        resultsDiv.innerHTML = '';
        displayResults(aiData, 'There’s an AI for That', resultsDiv);
        displayResults(productHuntData, 'Product Hunt', resultsDiv);
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error al buscar herramientas: ${error.message}</p>`;
    }
}

function displayResults(data, source, resultsDiv) {
    if (!data || !data.length) {
        resultsDiv.innerHTML += `<p>No se encontraron resultados en ${source}.</p>`;
        return;
    }

    data.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
            <h2>${item.name}</h2>
            <p>${item.description}</p>
            <a href="${item.url}" target="_blank">Visitar</a>
        `;
        resultsDiv.appendChild(resultItem);
    });
}
