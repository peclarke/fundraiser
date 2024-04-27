import useWebSocket from "react-use-websocket";
import { useStoreActions, useStoreState } from "../../hooks";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { WS_URL } from "../../consts";

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
    }
  ];

const Milestones = () => {
    const donations = useStoreState((state) => state.donations);
    const milestones = [...useStoreState((state) => state.milestones)];
    milestones.forEach((milestone: any, index) => {
        milestone["id"] = index;
        return milestone; 
    })

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

    return (
        <div className="tab">
            <h2>Donation Milestones</h2>
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