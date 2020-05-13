import React from "react";

import './VinylSleeve.css';

function VinylSleeve(props: { image: string, animationTime: string }) {
    return (<div className='vinyl-sleeve'>
        <div className={'vinyl-sleeve__image'} style={{backgroundImage: `url(${props.image})`}} />
        <div className={'vinyl-sleeve__vinyl'} style={{animationDuration: props.animationTime}} />
    </div>)
}

export default VinylSleeve;