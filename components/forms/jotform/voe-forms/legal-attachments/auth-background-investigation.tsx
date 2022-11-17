import React from 'react'
import { PageProps } from '../../../../../types/jotform/page-props.type'
import styles from "../../../../../styles/jotform.module.css";
import { Col, Row } from 'react-bootstrap';

export interface AuthBackgroundInvestigationProps extends PageProps { }

export default function AuthBackgroundInvestigation() {
  return (
    <form>
        <div className='Row'>
            <div>
                <h1 style={{fontWeight:'bold', textAlign:"center"}}>Nautilus Trucking</h1>
            </div>
        </div>
        <div className='Row'>
            <div>
                <h4 style={{fontWeight:'bold', textAlign:"center"}}>DISCLOSURE AND AUTHORIZATION REGARDING BACKGROUND INVESTIGATION FOR EMPLOYMENT PURPOSES</h4>
            </div>
        </div>
        <div className='Row'>
            <h4 style={{fontWeight:'bold', textAlign:"center"}}>DISCLOSURE</h4>
        </div>
        <div className='Row' style={{textAlign:'left',marginBottom:'20px'}}>
            <p style={{ color:'black',display:'inline'}}>Nautilus Trucking (the “Company”) may request from a consumer reporting agency and for employment-related purposes, a “consumer report(s)” (commonly known as “background reports”) containing background information about you in connection with your employment, or application for employment, or engagement for services (including independent contractor or volunteer assignments, as applicable).</p>
        </div>
        <div className='Row' style={{textAlign:'left',marginBottom:'20px'}}>
            <p style={{ color:'black',display:'inline'}}>The background report(s) may contain information concerning your character, general reputation, personal characteristics, mode of living, or credit standing. The types of background information that may be obtained include, but are not limited to: criminal history; litigation history; motor vehicle record and accident history; social security number verification; address and alias history; credit history; verification of your education, employment and earnings history; professional licensing, credential and certification checks; drug/alcohol testing results and history; military service; and other information.</p>
        </div>
        <div className='Row' style={{textAlign:'center',marginBottom:'20px'}}>
            <h4 style={{ color:'black',fontWeight:'bold'}}>AUTHORIZATION</h4>
        </div>
        <div className='Row' style={{textAlign:'left',marginBottom:'20px'}}>
            <p style={{ color:'black',display:'inline'}}>I hereby authorize Company to obtain the consumer reports described above about me.</p>
        </div>
        <div className='Row' style={{textAlign:'left',marginBottom:'20px'}}>
            <div className='Col'>
            <p style={{color:'black', fontWeight:'bold',display:'inline'}}>Name:</p>
                <p style={{ color:'black',display:'inline'}}>Test Name</p>
            </div>
        </div>
        <div className='Row' style={{textAlign:'left',marginBottom:'20px'}}>
            <div className='Col'>
            <p style={{color:'black', fontWeight:'bold',display:'inline'}}>Signature</p>
                <p style={{ color:'black',display:'inline'}}>Signature goes here</p>
            </div>
        </div>
        <div className='Row' style={{textAlign:'left',marginBottom:'20px'}}>
            <div className='Col'>
            <p style={{color:'black', fontWeight:'bold',display:'inline'}}>Date:</p>
                <p style={{ color:'black',display:'inline'}}>Saturday, October 15, 2022</p>
            </div>
        </div>

    </form>
  )
}
