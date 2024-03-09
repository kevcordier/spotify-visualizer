import React from "react";

import './RotateVinyl.css';

function RotateVinyl(props: { image: string, animationTime: string }) {
    return (<div className='rotate-vinyl' style={{animationDuration: props.animationTime}}>
        <div className={'rotate-vinyl__image'} style={{backgroundImage: `url(${props.image})`}} />
        <div className={'rotate-vinyl__vinyl'} />
    </div>)
}

export default RotateVinyl;