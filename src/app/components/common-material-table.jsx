import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Select
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const CrudTableComponent = (props) => {
  const [data,setData] = useState([])

  useEffect(() => {
    if (props.data) {
      setData(props.data)
    }
  },[props.data])

  return (
    <>
      <Box sx={{ py: 2, my: 3 }}>
        <MaterialReactTable
          initialState={props.initialState}
          displayColumnDefOptions={{
            'mrt-row-actions': {
              muiTableHeadCellProps: {
                align: 'center',
              },
              size: 120,
            },
          }}
          // columns, data, onEditRowSave, onEditRowCancel, handleDeleteRow, onButtonClick, open, onClose, onSubmit
          columns={props.columns}
          data={data}
          editingMode="modal" //default
          // creatingMode="modal" //default
          enableColumnOrdering
          enableEditing
          onEditingRowSave={props.onEditingRowSave}
          onEditingRowCancel={props.onEditingRowCancel}
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Tooltip arrow placement="left" title="Edit">
                <IconButton onClick={() => table.setEditingRow(row)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => props.handleDeleteRow}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          renderTopToolbarCustomActions={() => (
            <Button
              color="secondary"
              onClick={props.onButtonClick}
              variant="contained"
            >
              {props.title}
            </Button>
          )}
        />
        <CreateNewAccountModal
          columns={props.columns}
          open={props.open}
          onClose={props.onClose}
          onSubmit={props.onSubmit}
          title={props.title}
        />
      </Box>
    </>
  );
};

//CrudTableComponent of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit, title }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">{title}</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {
              columns.map((column,i) => (
                (column.muiTableBodyCellEditTextFieldProps.select) ? (
                  <FormControl key={i} variant="standard" >
                    <InputLabel id="demo-simple-select-standard-label">{column.header}</InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      key={column.accessorKey}
                      label={column.header}
                      name={column.accessorKey}
                      onChange={(e) =>
                        setValues({ ...values, [e.target.name]: e.target.value })
                      }
                    >
                      {(column.options).map((elem, key) => (
                        <MenuItem key={key} value={elem}>{elem}</MenuItem>
                      ))}

                    </Select>
                  </FormControl>
                ) : (

                  column.type == 'date' ? (
                    <TextField
                      type={column.type}
                      variant="standard"
                      key={column.accessorKey}
                      label={column.header}
                      name={column.accessorKey}
                      // InputLabelProps={{
                      //   shrink: true
                      // }}
                      onChange={(e) =>
                        setValues({ ...values, [e.target.name]: e.target.value })
                      }
                    // multiline
                    />
                  ) : (
                    column.accessorKey == 'id'  ? (
                      <TextField
                      type={column.type}
                      variant="standard"
                      key={column.accessorKey}
                      label={column.header}
                      name={column.accessorKey}
                      disabled
                      // InputLabelProps={{
                      //   shrink: true
                      // }}
                      // onChange={(e) =>
                      //   setValues({ ...values, [e.target.name]: e.target.value })
                      // }
                      // multiline
                    />
                    ) : (                    
                      <TextField
                      type={column.type}
                      variant="standard"
                      key={column.accessorKey}
                      label={column.header}
                      name={column.accessorKey}
                      // InputLabelProps={{
                      //   shrink: true
                      // }}
                      onChange={(e) =>
                        setValues({ ...values, [e.target.name]: e.target.value })
                      }
                      multiline
                    />
                    )
                  )

                )

              ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          {title}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


export default CrudTableComponent;