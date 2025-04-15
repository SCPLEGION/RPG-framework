import { ApiReferenceReact } from '@scalar/api-reference-react'
import '@scalar/api-reference-react/style.css'
import yaml from 'js-yaml';
import { useEffect, useState } from 'react';

function Docs() {
    const [Data, Setdata] = useState(null);

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
                let yamls
                Setdata(yaml);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

return (
    <ApiReferenceReact
        configuration={{
            url: '/api/swagger.yaml',
        }}
    />
)
}

export default Docs