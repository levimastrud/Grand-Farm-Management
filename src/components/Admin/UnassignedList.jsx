import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Collapse, Button, CardBody, Card, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


function UnassignedList(props) {
    //console.log('in unassigned list', unassign);
    const unassign = props.unassign;
    const [company, setCompany] = useState(unassign.company_id)
    
    return (
        <div key={unassign.id}>
            <h4>{unassign.first_name} {unassign.last_name} {unassign.email} </h4>
            <button>Add</button>
        </div>
    )
}

export default UnassignedList;