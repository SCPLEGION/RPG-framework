import { ApiReferenceReact } from '@scalar/api-reference-react'
import '@scalar/api-reference-react/style.css'
import { useEffect } from 'react';

function Docs() {

    useEffect(() => {
        fetch('/api/data')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched data:', data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

return (
    <ApiReferenceReact
        configuration={{
            url: '/api/data',
        }}
    />
)
}

export default Docs