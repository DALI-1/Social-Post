import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MDBCheckbox } from 'mdb-react-ui-kit';
import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { GridPDFExport } from '@progress/kendo-react-pdf';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { IntlProvider, load, LocalizationProvider, loadMessages, IntlService } from '@progress/kendo-react-intl';
import likelySubtags from 'cldr-core/supplemental/likelySubtags.json';
import currencyData from 'cldr-core/supplemental/currencyData.json';
import weekData from 'cldr-core/supplemental/weekData.json';
import numbers from 'cldr-numbers-full/main/es/numbers.json';
import currencies from 'cldr-numbers-full/main/es/currencies.json';
import caGregorian from 'cldr-dates-full/main/es/ca-gregorian.json';
import dateFields from 'cldr-dates-full/main/es/dateFields.json';
import timeZoneNames from 'cldr-dates-full/main/es/timeZoneNames.json';
import { process } from '@progress/kendo-data-query';
import { Avatar } from "@nextui-org/react";
import esMessages from './es.json';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import * as variables from "../../variables/variables"
import {
  ListView,
  ListViewHeader,
  ListViewFooter,
} from "@progress/kendo-react-listview";
load(likelySubtags, currencyData, weekData, numbers, currencies, caGregorian, dateFields, timeZoneNames);

loadMessages(esMessages, 'es-ES');

const DATE_FORMAT = 'yyyy-mm-dd hh:mm:ss.SSS';
const intl = new IntlService('en');
/*orders.forEach(o => {
  o.orderDate = intl.parseDate(o.orderDate ? o.orderDate : '20/20/2020', DATE_FORMAT);
  o.shippedDate = o.shippedDate ? undefined : intl.parseDate(o.shippedDate ? o.orderDate.toString() : '20/20/2020', DATE_FORMAT);
});*/

function findIndexByProp(list, prop, value) {
  
  for (let i = 0; i < list.length; i++) {
    if (list[i][prop] === value) {
      return i;
    }
  }
  return -1; // not found
}

const DetailComponent = props => {
  const dataItem = props.dataItem;
  
  return <div><section style={{float: "left"}}>
      {/*This indicate that this is a Facebook Page and we handle it with different attributes*/}         
              {dataItem.PageDetails.category!=undefined&&<p><strong>Page Category:</strong>{dataItem.PageDetails.category} </p>}
             {dataItem.PageDetails.followers_count!=undefined&& <p><strong>Page followers:</strong> {dataItem.PageDetails.followers_count}</p>}
              {dataItem.PageDetails.fan_count!=undefined&&<p><strong>Page fans:</strong>{dataItem.PageDetails.fan_count} </p>}
           {/*Here we're gonna show which pages our current page is connected or related to */}   
              {dataItem.OtherPlatformAccountsDetails.length>0&&
                  <>
                  <ListViewHeader className="pl-3 pb-2 pt-2" style={{fontSize: 14}}><strong>Associated Pageslist:</strong></ListViewHeader>
                    {dataItem.OtherPlatformAccountsDetails.map((e,index)=>{
                      //here we testing by profile_picture_url attribute, if it's not undefined then the related page is an instagram page, else its a facebook one
                      if(e.value.profile_picture_url!=undefined)
                      {
                        return(
                          <div className="k-listview-item row p-2 border-bottom align-middle" style={{ margin: 0}}>
                          <div className="col-2 m-2"> <Avatar size="lg" src={e.value.profile_picture_url} color="gradient"   squared zoomed/></div>
                          {/*<div className="col-3 m-2">
                          <h2 style={{ fontSize: 14, color: "#454545",marginBottom: 0, }} className="text-uppercase">  Account Username</h2>
                        <div style={{fontSize: 12,color: "#a0a0a0", }}>{e.value.username }</div> </div>*/}
                          <div className="col-4 m-2">
                          <h2 style={{ fontSize: 14, color: "#454545",marginBottom: 0, }} className="text-uppercase"> Page Name</h2>
                          <div style={{fontSize: 12,color: "#a0a0a0", }}>{e.value.name }</div></div>
                          <div className="col-2 m-2">
                          <Avatar size="lg" src={dataItem.PagePlatformDetails[index+1].platformLogoImageUrl} color="gradient"   squared zoomed/>
                          </div></div>) 
                      }
                      //This indicate that this is a Facebook Page and we handle it with different attributes
                      if(e.value.profile_picture_url==undefined)
                      {
                        return(
                          <div className="k-listview-item row p-2 border-bottom align-middle" style={{ margin: 0}}>
                          <div className="col-2 m-2"> <Avatar size="lg" src={e.value.picture.data.url} color="gradient"   squared zoomed/></div>
                          {/*<div className="col-3 m-2">
                          <h2 style={{ fontSize: 14, color: "#454545",marginBottom: 0, }} className="text-uppercase">  Account Username</h2>
                        <div style={{fontSize: 12,color: "#a0a0a0", }}>{e.value.username }</div> </div>*/}
                          <div className="col-4 m-2">
                          <h2 style={{ fontSize: 14, color: "#454545",marginBottom: 0, }} className="text-uppercase"> Page Name</h2>
                          <div style={{fontSize: 12,color: "#a0a0a0", }}>{e.value.name }</div></div>
                          <div className="col-2 m-2">
                          <Avatar size="lg" src={dataItem.PagePlatformDetails[index+1].platformLogoImageUrl} color="gradient"   squared zoomed/>
                          </div></div>) 
                      }})}</>}
                     {dataItem.OtherPlatformAccountsDetails.length==0&&
              <p> <strong>Associated Pageslist:</strong> This Page is not Associated to Any other page. </p>}
            </section><style>{`.k-listview-footer {border-top-width: 0 !important;}`}</style>
            </div>}; 

export default function App(props)  { 
  let Data=props.data
  const locales = [{
    language: 'en-US',
    locale: 'en'
  }, {
    language: 'es-ES',
    locale: 'es'
  }];
  const [dataState, setDataState] = React.useState({
    skip: 0,
    take: 20,
    sort: [{
      field: 'followers_count',
      dir: 'asc'
    }],
    group: []
      
   //[{field: 'PageDetails.name' }]
  });
  
  const [currentLocale, setCurrentLocale] = React.useState(locales[0]);
  const [dataResult, setDataResult] = React.useState(process(Data, dataState));
  const handlePageCheck=(props)=>
  {
    var element=document.getElementById("CHECKBOX"+props.ID)
   
    if(element.checked)
    {
      variables.Pages.ListOfSelectedPages=[...variables.Pages.ListOfSelectedPages,props]
    }
    else
    {   
      let index = findIndexByProp(variables.Pages.ListOfSelectedPages, 'ID', props.ID);
      variables.Pages.ListOfSelectedPages.splice(index,1)
   
    }
    
    console.log(variables.Pages.ListOfSelectedPages)
  }
  const dataStateChange = event => {
    setDataResult(process(Data, event.dataState));
    setDataState(event.dataState);
  };
  const expandChange = event => {
    const isExpanded = event.dataItem.expanded === undefined ? event.dataItem.aggregates : event.dataItem.expanded;
    event.dataItem.expanded = !isExpanded;
    setDataResult({
      ...dataResult
    });
  };
  let _pdfExport;
  const exportExcel = () => {
    _export.save();
  };
  let _export;
  const exportPDF = () => {
    _pdfExport.save();
  };
  return( <LocalizationProvider language={currentLocale.language}>
            <IntlProvider locale={currentLocale.locale}>
              <div>

                {/*This Part here is what we gonna export to Excel it starts from here */}
                <ExcelExport data={Data} ref={exporter => {
          _export = exporter;
        }}>

          {/*Here is our Table */}
                  <Grid style={{
            height: '700px'
          }} sortable={true} filterable={true} groupable={true} reorderable={true} pageable={{
            buttonCount: 4,
            pageSizes: true
          }} data={dataResult} {...dataState} onDataStateChange={dataStateChange} detail={DetailComponent} expandField="expanded" onExpandChange={expandChange}>
                    <GridToolbar>
                      Locale:&nbsp;&nbsp;&nbsp;
                      <DropDownList value={currentLocale} textField="language" onChange={e => {
                setCurrentLocale(e.target.value);
              }} data={locales} />&nbsp;&nbsp;&nbsp;
                      <button title="Export to Excel" className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-info" onClick={exportExcel}>
                        Export to Excel
                      </button>&nbsp;
                      <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-info" onClick={exportPDF}>Export to PDF</button>
                    </GridToolbar>
                   
                   {/* This Gridl Column shows the checkbox that allows you to select which page to modify */}
                    <GridColumn locked={true} filterable={false} width={"50px"} cell={(props)=>{
             if(props.dataItem.items==undefined)
             {
                   let Checkbox_Is_Checked=false
                     variables.Pages.ListOfSelectedPages.map((SelectedPages)=>{
                         if(props.dataItem.PageDetails.id==SelectedPages.ID)
                         {
                          Checkbox_Is_Checked=true
                          
                         }
                     })
                     if(Checkbox_Is_Checked==true)
                     {
                      return(
               
                        <td columnSpan={1}>
                        <div style={{display: "flex",justifyContent: "center", alignItemsn: "center"}}>
                          
                        <MDBCheckbox id={"CHECKBOX"+props.dataItem.PageDetails.id} key={"CHECKBOX"+props.dataItem.PageDetails.id} name='flexCheck'  defaultChecked onChange={()=>{handlePageCheck({"ID":props.dataItem.PageDetails.id,"name":props.dataItem.PageDetails.name})}}/>
                        </div>
                        </td>)
                     }
                     else
                     {
                      return(
               
                        <td columnSpan={1}>
                        <div style={{display: "flex",justifyContent: "center", alignItemsn: "center"}}>
                          
                        <MDBCheckbox id={"CHECKBOX"+props.dataItem.PageDetails.id} key={"CHECKBOX"+props.dataItem.PageDetails.id} name='flexCheck'  onChange={()=>{handlePageCheck({"ID":props.dataItem.PageDetails.id,"name":props.dataItem.PageDetails.name})}}/>
                        </div>
                        </td>)
                     }
                 
              
             }
             else
             {
              return(<td></td>)
             } 
                 }}>
        </GridColumn>

        {/*This Grid Collumn shows the Page Name and image */}
        <GridColumn style={{margin:"10px"}}  locked={true} filterable={true} cell={(props)=>{
                    if(props.dataItem.items==undefined)
                   {

                    // If the response has a .picture it means teh page is a FB Page and we show it this way
                    if(props.dataItem.PageDetails.picture!=undefined)
                    {
                      return(<td>
                        <Container >
                        <Row className="d-flex justify-content-center align-items-center" >
                         <Col >
                         <Avatar size="lg" src={props.dataItem.PageDetails.picture.data.url} color="gradient"   squared zoomed/>
                         </Col>
                         <Col><p className="m-1">{props.dataItem.PageDetails.name}</p></Col>
                        </Row>
                        </Container>
                        </td>)
                    }
                     //else its an instagram picture
                    if(props.dataItem.PageDetails.profile_picture_url!=undefined)
                    {
                      return(<td>
                        <Container >
                        <Row className="d-flex justify-content-center align-items-center" >
                         <Col >
                         <Avatar size="lg" src={props.dataItem.PageDetails.profile_picture_url} color="gradient"   squared zoomed/>
                         </Col>
                         <Col><p className="m-1">{props.dataItem.PageDetails.name}</p></Col>
                        </Row>
                        </Container>
                        </td>)
                    }
                      

                   }}}  title="Page Name " field='PageDetails.name'>
                 
        </GridColumn> 

         {/*This Grid Collumn shows the Page supported platforms */}
        <GridColumn style={{margin:"10px"}}  locked={true} filterable={false} cell={(props)=>{
                    if(props.dataItem.items==undefined)
                   {
                       return(
                       <td>
                        <Container >
                        <Row className="d-flex justify-content-center align-items-center">
                         {props.dataItem.PagePlatformDetails.map((plat)=>{return(<Col><Avatar className="m-1" size="lg" src={plat.platformLogoImageUrl} color="gradient" zoomed/></Col>)})}
                         </Row> </Container> </td>) }}}  title="Supported platforms ">    
        </GridColumn>  
        {/* This Grid Column shows the Page Owner Image and name */}      
        <GridColumn style={{margin:"10px"}}  locked={true} filterable={true}  title="Page Owner" cell={(props)=>{
                    if(props.dataItem.items==undefined)
                   {
                       return(<td>
                      <Container >
                      <Row className="d-flex justify-content-center align-items-center">
                        <Col>
                        <Avatar size="lg" src={props.dataItem.PageOwnerDetails.picture.data.url} color="gradient"  zoomed/>
                        </Col>
                        <Col>
                        <p className="m-1">{props.dataItem.PageOwnerDetails.name}</p>
                        </Col>
                      </Row>
                      </Container>
                       </td>)
                   }}} field="PageOwnerDetails.name" >
                     
                   </GridColumn>
                  {/*This Grid Column just shows the owner's Email */}
                 
                    <GridColumn field="PageOwnerDetails.email"  title="Page Owner Email"></GridColumn>
                   
                   
                  </Grid>
                </ExcelExport>


                {/*This Part here is what we gonna export to Excel it Ends here */}

                {/*This Part here is what we gonna export to PDF it starts from here */}
                <GridPDFExport ref={element => {
          _pdfExport = element;
        }} margin="1cm">
                  {<Grid data={process(Data, {
            skip: dataState.skip,
            take: dataState.take
          })}>
                         {/* This Gridl Column shows the checkbox that allows you to select which page to modify */}
                         <GridColumn locked={true} filterable={false} width={"50px"} cell={(props)=>{
             if(props.dataItem.items==undefined)
             {
                   let Checkbox_Is_Checked=false
                     variables.Pages.ListOfSelectedPages.map((SelectedPages)=>{
                         if(props.dataItem.PageDetails.id==SelectedPages.ID)
                         {
                          Checkbox_Is_Checked=true
                          
                         }
                     })
                     if(Checkbox_Is_Checked==true)
                     {
                      return(
               
                        <td columnSpan={1}>
                        <div style={{display: "flex",justifyContent: "center", alignItemsn: "center"}}>
                          
                        <MDBCheckbox id={"CHECKBOX"+props.dataItem.PageDetails.id} key={"CHECKBOX"+props.dataItem.PageDetails.id} name='flexCheck'  defaultChecked onChange={()=>{handlePageCheck({"ID":props.dataItem.PageDetails.id,"name":props.dataItem.PageDetails.name})}}/>
                        </div>
                        </td>)
                     }
                     else
                     {
                      return(
               
                        <td columnSpan={1}>
                        <div style={{display: "flex",justifyContent: "center", alignItemsn: "center"}}>
                          
                        <MDBCheckbox id={"CHECKBOX"+props.dataItem.PageDetails.id} key={"CHECKBOX"+props.dataItem.PageDetails.id} name='flexCheck'  onChange={()=>{handlePageCheck({"ID":props.dataItem.PageDetails.id,"name":props.dataItem.PageDetails.name})}}/>
                        </div>
                        </td>)
                     }
                 
              
             }
             else
             {
              return(<td></td>)
             } 
                 }}>
        </GridColumn>

        {/*This Grid Collumn shows the Page Name and image */}
        <GridColumn style={{margin:"10px"}}  locked={true} filterable={true} cell={(props)=>{
                    if(props.dataItem.items==undefined)
                   {

                    // If the response has a .picture it means teh page is a FB Page and we show it this way
                    if(props.dataItem.PageDetails.picture!=undefined)
                    {
                      return(<td>
                        <Container >
                        <Row className="d-flex justify-content-center align-items-center" >
                         <Col >
                         <Avatar size="lg" src={props.dataItem.PageDetails.picture.data.url} color="gradient"   squared zoomed/>
                         </Col>
                         <Col><p className="m-1">{props.dataItem.PageDetails.name}</p></Col>
                        </Row>
                        </Container>
                        </td>)
                    }
                     //else its an instagram picture
                    if(props.dataItem.PageDetails.profile_picture_url!=undefined)
                    {
                      return(<td>
                        <Container >
                        <Row className="d-flex justify-content-center align-items-center" >
                         <Col >
                         <Avatar size="lg" src={props.dataItem.PageDetails.profile_picture_url} color="gradient"   squared zoomed/>
                         </Col>
                         <Col><p className="m-1">{props.dataItem.PageDetails.name}</p></Col>
                        </Row>
                        </Container>
                        </td>)
                    }
                      

                   }}}  title="Page Name " field='PageDetails.name'>
                 
        </GridColumn> 

         {/*This Grid Collumn shows the Page supported platforms */}
        <GridColumn style={{margin:"10px"}}  locked={true} filterable={false} cell={(props)=>{
                    if(props.dataItem.items==undefined)
                   {
                       return(
                       <td>
                        <Container >
                        <Row className="d-flex justify-content-center align-items-center">
                         {props.dataItem.PagePlatformDetails.map((plat)=>{return(<Col><Avatar className="m-1" size="lg" src={plat.platformLogoImageUrl} color="gradient" zoomed/></Col>)})}
                         </Row> </Container> </td>) }}}  title="Supported platforms ">    
        </GridColumn>  
        {/* This Grid Column shows the Page Owner Image and name */}      
        <GridColumn style={{margin:"10px"}}  locked={true} filterable={true}  title="Page Owner" cell={(props)=>{
                    if(props.dataItem.items==undefined)
                   {
                       return(<td>
                      <Container >
                      <Row className="d-flex justify-content-center align-items-center">
                        <Col>
                        <Avatar size="lg" src={props.dataItem.PageOwnerDetails.picture.data.url} color="gradient"  zoomed/>
                        </Col>
                        <Col>
                        <p className="m-1">{props.dataItem.PageOwnerDetails.name}</p>
                        </Col>
                      </Row>
                      </Container>
                       </td>)
                   }}} field="PageOwnerDetails.name" >
                     
                   </GridColumn>
                  {/*This Grid Column just shows the owner's Email */}
                 
                    <GridColumn field="PageOwnerDetails.email"  title="Page Owner Email"></GridColumn>
                   
                  </Grid>}
                </GridPDFExport>
                {/*This Part here is what we gonna export to PDF it Ends here */}
              </div>
            </IntlProvider>
          </LocalizationProvider>);
};
