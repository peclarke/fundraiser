import useWebSocket from "react-use-websocket";
import { useStoreActions, useStoreState } from "../../hooks";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { WS_URL } from "../../consts";
import { Fab } from "@mui/material";

const Milestones = () => {
    const donations = useStoreState((state) => state.donations);
    const milestones = useStoreState((state) => state.milestones);
    milestones.forEach((milestone: any, index) => {
        milestone["id"] = index;
        return milestone; 
    })

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'id',
            type: 'number',
            editable: false,
            align: 'left',
            headerAlign: 'left',
            width: 5
        },
        { 
          field: 'goal',
          headerName: 'Goal', 
          type: "number", 
          width: 100, 
          editable: true,
          align: 'left',
          headerAlign: 'left',
        },
        {
          field: 'desc',
          headerName: 'Description',
          type: 'string',
          width: 270,
          editable: true,
          align: 'left',
          headerAlign: 'left',
        },
        {
            field: 'delete',
            headerName: '',
            width: 40,
            editable: false,
            renderCell: (params) => { 
                return (
                    <DeleteIcon 
                        className="icon-delete"
                        onClick={() => deleteRow(params.row.id)}
                    />
                )
            }
        }
      ];

    const { sendJsonMessage } = useWebSocket(WS_URL, {
        onOpen: () => {
          console.log('WebSocket connection established.');
        },
        share: true,
        filter: () => false,
        retryOnError: true,
        shouldReconnect: () => true
    });

    const update = useStoreActions((actions) => actions.setMilestones);

    const handle = (newRow: {id: number; goal: number; desc: string;}) => {
        const temp = milestones.filter(milestone => milestone.id !== newRow.id);
        temp.push(newRow);
        temp.sort((a, b) => a.goal - b.goal);
        console.log(newRow);
        console.log(temp);

        temp.forEach((milestone, _index) => {
            delete milestone['id'];
        })
        update(temp);
        sendJsonMessage({type: 'update', content: {
            donations: donations,
            milestones: temp
        }})
    }

    const add = () => {
        const newRow = { goal: -1, desc: "", id: milestones.length }
        update([...milestones, newRow])
    }

    const deleteRow = (rowId: number) => {
        const newMilestones = milestones.filter(milestone => milestone.id !== rowId);
        newMilestones.forEach((milestone, _index) => {
            delete milestone['id'];
        })
        update(newMilestones);
        sendJsonMessage({type: 'update', content: {
            donations: donations,
            milestones: newMilestones
        }})
    }

    return (
        <div className="tab">
            <div className="milestone-title">
                <h2>Donation Milestones</h2>
                <Fab 
                    color="primary" 
                    aria-label="add" 
                    id="milestone-add" 
                    size={"small"} 
                    onClick={add}
                    disabled={milestones.some(milestone => milestone.goal === -1)}
                >
                    <AddIcon />
                </Fab>
            </div>
            <DataGrid 
                rows={milestones} 
                columns={columns} 
                getRowId={(row) => row.goal} 
                style={{width: "100%"}}
                editMode="row"
                processRowUpdate={(newRow) => handle(newRow)}
                onProcessRowUpdateError={(error) => console.log("Error: "+error)}
            />
        </div>
    )
}

export default Milestones;