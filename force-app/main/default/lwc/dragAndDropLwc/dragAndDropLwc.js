import { LightningElement,wire } from 'lwc';
import { getListUi} from 'lightning/uiListApi';
import {refreshApex} from '@salesforce/apex'
import { getPicklistValues,getObjectInfo} from 'lightning/uiObjectInfoApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import Id_FIELD from '@salesforce/schema/Opportunity.Id';
import { updateRecord } from 'lightning/uiRecordApi'; 
import { ShowToastEvent } from 'lightning/platformShowToastEvent'


export default class DragAndDropLwc extends LightningElement {
    records;
    pickVals;
    recordId;
    /*fetching Opp list */
    @wire(getListUi,{
        objectApiName: OPPORTUNITY_OBJECT,
        listViewApiName:'AllOpportunities'
    })wiredListView({error,data}) {
        if(data){
            console.log("getListUi", data);
            this.records = data.records.records.map(item=>{
            let field = item.fields
            let account = field.Account.value.fields
            return {'Id':field.Id.value, 
                    'Name':field.Name.value,
                    'AccountId':account.Id.value,
                    'AccountName':account.Name.value,
                    'CloseDate':field.CloseDate.value,
                    'StageName':field.StageName.value,
                    'Amount':field.Amount.value }
            })
        }
        if(error) {
            console.error(error)
        }
    }
    /**get metadata */
    @wire(getObjectInfo, { objectApiName : OPPORTUNITY_OBJECT})
    objectInfo
    /**fetching stage picklist */
    @wire(getPicklistValues, {
        recordTypeId : '$objectInfo.data.defaultRecordTypeId', 
        fieldApiName : STAGE_FIELD
    })stagePicklistValues({data,error}) {
        if(data) {
            console.log("stage picklist",data)
            this.pickVals = data.values.map(item=> item.value);
            console.log("picklist values",this.pickVals)
        }
        if(error) {

        }
    }
    /***getter to calculate the width */
    get calcWidth() {
        let len = this.pickVals.length + 1
        return `width : calc(100vw/${len})`

    }
    handleListItemDrag(event) {
        this.recordId = event.detail
    }
    handleItemDrop(event) {
        let stage = event.detail
        // this.records = this.records.map(item=> {
        //     return item.Id === recordId ? {...item, StageName : stage} : {...item}
        // })
        this.updateHandler(stage)
    }
    updateHandler(stage) {
        const fields = {}
        fields[Id_FIELD.fieldApiName] = this.recordId
        fields[STAGE_FIELD.fieldApiName] = stage
        const recordInput = {fields}
        updateRecord(recordInput)
        .then(()=> {
            console.log("updated successfull")
            this.showToast()
            return refreshApex(this.wiredListView)
        }).catch(error=> {
            console.error(error)
        })
    }
    showToast () {
        const event = new ShowToastEvent({
            title: 'Success',
            message: 'Stage Updated Successfully',
            variant : 'success'
        });
        this.dispatchEvent(event);
    }
        
    

    
}