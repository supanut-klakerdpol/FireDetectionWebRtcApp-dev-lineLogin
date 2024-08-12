import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Box, Button, TextField

} from "@mui/material";
import Stack from '@mui/material/Stack';
import { useEffect } from "react";
import VideoFrame from "./video-frame";
import {
  fetchAuthSession,
  CredentialsAndIdentityIdProvider,
  CredentialsAndIdentityId,
  GetCredentialsOptions,
  AuthTokens,
} from 'aws-amplify/auth';
import PrimarySearchAppBar from '../nav';
import {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import { faFire, faSignOut } from '@fortawesome/free-solid-svg-icons'
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { integer } from "aws-sdk/clients/cloudfront";
import { getCurrentUser } from 'aws-amplify/auth';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';

// const channels = [ 
//   { label: "video-1", value: "arn:aws:kinesisvideo:us-east-1:914374409233:channel/snscamera1/1706521915738" },
//   { label: "video-2", value: "arn:aws:kinesisvideo:us-east-1:914374409233:channel/snscamera2/1706521928859" },
//   { label: "video-3", value: "arn:aws:kinesisvideo:us-east-1:914374409233:channel/snscamera3/1706606518246" },
//   { label: "video-4", value: "arn:aws:kinesisvideo:us-east-1:914374409233:channel/snscamera4/1706606531588" },
//   { label: "video-5", value: "arn:aws:kinesisvideo:us-east-1:914374409233:channel/snscamera5/1706606555250" },
// ];

function VideoPlayer({ onSignOut }: { onSignOut: () => void }) {
  
  const [camera, setCamera] = useState(0);

  const onChange = (event: SelectChangeEvent<number>) => {
    setCamera(event.target.value as number);
  }

  const [ credentials, setCredentials ] = useState<any>();
  const [ config, setConfig] = useState<any>();
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showAlert, setAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [channels, setChannels] = useState([{label:'', value:''}]);
  const [locationId, setLocationId] = useState('')
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [auth, setAuth] = React.useState(true);

  const theme = createTheme({
    palette: {
      primary: red,
      secondary: red,
    },
  });

  async function getUserId() {
    const { username, userId, signInDetails } = await getCurrentUser();
    console.log(userId)
    return userId 
  }
  
  useEffect(()=> {
    const getCreds = async () => {
      const {
        tokens,
        credentials,
        identityId,
        userSub
    } = await fetchAuthSession();
      setCredentials(credentials);
    }
    getCreds();
  
  }, [])


  async function fetchChannels(uid: string) {
    
      var response = await fetch(`https://2psovbmr51.execute-api.us-east-1.amazonaws.com/dev/userscctv?uid=${uid}`, {mode:'cors'}); 
      console.log(response.status)
      if (response.status === 200) {
        const data = await response.json();
        setAlert(false)
        setShowVideoPlayer(true);
        console.log("Result queries", data)
        return JSON.parse(data.body); // Assuming your API returns an array of channels
      }
      else if (response.status === 204) {
        setAlert(true)
        return null;
      }
       else {
        setShowVideoPlayer(false);
        return null;
      }
  
  }

  useEffect(() => {
    
  }, []);

  // useEffect(() => {
  //   const checkServerStatus = async () => {
  //     setIsLoading(true);

  //     try {
  //       const response = await fetch('https://2psovbmr51.execute-api.us-east-1.amazonaws.com/dev/userscctv?uid=test', {mode:"cors"}); // Replace with actual endpoint
  //       if (response.status === 200) {
  //         const data = await response.json()
  //         console.log(JSON.parse(data.body))
  //         setShowVideoPlayer(true);
  //       } 
  //     } catch (error) {
  //       console.error("Error fetching server status:", error);
  //     } finally {
  //       setIsLoading(false); 
  //     }
  //   }

  //   checkServerStatus();
  // }, []);

  const handleChange = (event:any) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const activateUi = () => {
    setShowVideoPlayer(false);
  };

  const  handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log(locationId)

    const userId = await getUserId()
    try {
      const response = await fetch(`https://2psovbmr51.execute-api.us-east-1.amazonaws.com/dev/userscctv?uid=${userId}&locationId=${locationId}`, {
        method: 'POST',
        mode:'cors',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.status == 200){
        const data = await response.json(); // Assuming API returns JSON
        window.location.reload();
        
      }
      else if (response.status == 204){
   
        setAlert(true)
        
      }
      

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    

}

  const myStyles = {
    background: "#ffffff",
    boxShadow: "20px 20px 90px #d9d9d9,-20px -20px 90px #ffffff"
  };

  const  customMorp = { background: "#ffffff",
        boxShadow:  "20px 20px 61px #d9d9d9,-20px -20px 61px #ffffff"};

  const buttonSignout = {
  background: "linear-gradient(145deg, #cb4d4d, #f25b5b)",
  boxShadow:  "1px 1px 3px #c04848,-1px -1px 8px #ff6262"}



  useEffect(()=> {
    const loadChannels = async () => { 
      const userId = await getUserId()
      const fetchedChannels = await fetchChannels(userId); 
      const channels = fetchedChannels.map((arn: string, index : integer) => {
        const label = `video-${index + 1}`;
        return { label: label, value: arn };
      });
      
      setChannels(channels);
     
      
    };

    
    loadChannels();
    

    console.log("Set up new config : ", channels[camera])
    if (channels !== null) {
    setConfig({
      credentials,
      debug: true,
      media: undefined,
      channelARN: channels[camera].value,
      region: 'ap-southeast-1',
    })
  }
  },[credentials, camera]);


  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);





  if (!config?.credentials) {
    return (<>
       <div className="grid grid-cols-1 gap-4 p-4 justify-center py-auto my-auto">
        <div className="flex items-center justify-center">
          <CircularProgress />
        </div>
        <p>Loading ...</p>
      </div>
      </>
    )
    
  }

  return (
    <>
        <div className="grid grid-cols-1 h-[15vh]">
      <nav className="flex-none bg-white border-gray-100 dark:bg-gray-900 border-b-2 border-gray-200">
        <div className="grid grid-cols-1 md:flex gap-4 justify-between mx-auto p-4" style={myStyles}>
          <div className="Logo flex-none">
            <a href="" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="logo_nexty.png" className="h-12" alt="Flowbite Logo" />
              <span className="text-sm font-semibold whitespace-nowrap  text-left">
                TOYOTA TSUSHO<br /> NEXTY ELECTRONICS <br/> (THAILAND) CO., LTD.
              </span>
            </a>
          </div>
          <div className="flex gap-4">
            <FormControl fullWidth className="rounded bg-gray-50">
              <InputLabel id="camera-label" className="text-white">Camera</InputLabel>
              <Select
                labelId="camera-label"
                id="camera"
                value={camera}
                label={channels[camera].label}
                onChange={onChange}
              >
                {channels.map((option, index) => (
                  <MenuItem key={option.label} value={index}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="flex-none">

            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>

<Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={activateUi}>Activate code</MenuItem>
                <MenuItem onClick={onSignOut}>Logout</MenuItem>
              </Menu>


  {/* <div
    className="text-xs flex px-2 text-sm items-center text-white h-full bg-red-500 rounded hover:bg-blue-500 dark:bg-transparent dark:hover:bg-gray-700 font-bold"
    aria-current="page"
    onClick={onSignOut}
    style={buttonSignout}
  >
    SIGN OUT&nbsp;&nbsp;
    <br />
    <FontAwesomeIcon icon={faSignOut} style={{ color: "#ffffff" }} />
  </div> */}
</div>

          </div>
        </div>
      </nav>
      <div className="rounded  mt-4  place-items-center text-xl">
  <FontAwesomeIcon icon={faFire} style={{ marginRight: '10px', color: "#e70d39" }} />
  Real-Time Fire Detection Stream
</div>



<div className="bg-white rounded text-white flex-auto h-[65vh] md:h-[80vh] w-[90vw] m-auto mt-4 grid place-items-center gap-0" style={customMorp}>
  <div>

{showVideoPlayer ? (
        
          <VideoFrame config={config} />
        
      ) : (

          <div className="grid grid-cols-1 gap-10 text-black">
          Please enter a location code to view the video stream.
        
          <ThemeProvider theme={theme}>
          <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
          <TextField id="outlined-basic" label="Location Code" variant="outlined" onChange={e => setLocationId(e.target.value)} />
          <Button className="bg-black text-black" variant="contained" type="submit">Submit</Button>
          </Stack>
          </form>
          </ThemeProvider>
         
          
          </div>
     
      )}
      {(!showVideoPlayer && showAlert) && (
        <Alert severity="error" className="my-4">Please double-check the code and try again.</Alert>
      )} 
      </div>
      </div>
    </div>

    </>
  );
}
export default VideoPlayer;




