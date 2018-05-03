// @flow
import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

type Props = {
  editable: boolean,
  data: Array<Object>
}

export class PreviewTable extends Component {
  props: Props;

  static defaultProps = {
    editable: false,
    data: []
  }

  render(){
    return(
      <BootstrapTable {...this.props} data={this.props.data} striped insertRow={this.props.editable} deleteRow={this.props.editable}
        selectRow={ this.props.editable ? {mode: 'checkbox'} : {} } cellEdit={ this.props.editable ? {mode: 'click'} : {} }
      >
          <TableHeaderColumn isKey dataField='key'>Key</TableHeaderColumn>
          <TableHeaderColumn dataField='value'>Value</TableHeaderColumn>
      </BootstrapTable>
    )
  }
}
