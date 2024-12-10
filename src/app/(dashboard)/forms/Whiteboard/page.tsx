import React from 'react'
import NodeConfigurator from 'views/documentGen/ConfigureDocuments2'
import AiChatbot from 'components/aiChat'
const page = () => {
    return (
        <div>
            <NodeConfigurator />
            <AiChatbot/>
        </div>
    )
}

export default page;
