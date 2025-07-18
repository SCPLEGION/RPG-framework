import { ApiReferenceReact } from '@scalar/api-reference-react'
import '@scalar/api-reference-react/style.css'

function Docs() {

return (
    <ApiReferenceReact
        configuration={{
            url: '/api/swagger.yaml',
        }}
    />
)
}

export default Docs