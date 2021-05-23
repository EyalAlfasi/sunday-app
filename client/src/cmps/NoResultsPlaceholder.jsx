import React from 'react'
import clouds from '../assets/img/clouds.svg'
export const NoResultsPlaceholder = () => {
    return (
        <div style={{ textAlign: "center", padding: "50px 20px 0" }}>
            <img src={clouds} alt="clouds" style={{ maxWidth: "200px" }} />
            <h2 style={{ fontWeight: "300" }}>No results were found...</h2>
        </div>
    )
}
