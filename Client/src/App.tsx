import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { blue, purple } from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import 'typeface-roboto';

import RotateVinyl from "./components/RotateVinyl";
import VinylSleeve from "./components/VinylSleeve";

import './App.css';
import { Box, Container, Fab, Link, useMediaQuery } from '@mui/material';
export const authEndpoint = 'https://accounts.spotify.com/authorize';
const redirectUri = 'http://localhost:3000';
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
];
// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce((initial: any, item: string) => {
    if (item) {
      let parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";

const drawerWidth = 400;

const theme = createTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: 12,
  },
  palette: {
    primary: blue,
    secondary: purple,
  }
});

interface Player {
  image?: string,
  artists?: string,
  title?: string,
  tempo?: number,
}

interface Display {
  backgroundColor: string,
  imageDisplay: string,
  imageIsDisplay: boolean,
  textColor: string,
  titleSize: number,
  displayTitle: boolean,
  artistSize: number,
  displayArtist: boolean,
}

export const App = () => {
  const [token, setToken] = useState<string | null>();

  const [display, setDisplay] = useState<Display>({
    backgroundColor: '#00FF00',
    imageDisplay: 'vinyl',
    imageIsDisplay: true,
    textColor: '#FFFFFF',
    titleSize: 5,
    displayTitle: true,
    artistSize: 5,
    displayArtist: true,
  })

  const [player, setPlayer] = useState<Player>({
    image: 'https://i.scdn.co/image/ab67616d0000b2730a9a606015c3eda4843520bd',
    title: 'You Spin Me Round (Like a Record)',
    artists: 'Dead or Alive',
  });
  const { title, artists, image } = player;
  const [open, setOpen] = React.useState(false);
  const matches = useMediaQuery('(min-width:600px)');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  if (!token && hash.access_token) {
    let _token = hash.access_token;
    if (_token) {
      // Set token
      setToken(_token);

    }
  }

  const getCurrentlyPlaying = (token: string) => {
    fetch("https://api.spotify.com/v1/me/player", {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setPlayer({
          image: data.item.album.images[0].url,
          artists: Array.isArray(data.item.artists)
            ? data.item.artists.map((artist: any) => { return artist.name }).join(', ')
            : data.item.artists.name,
          title: data.item.name,
        })
      }).catch((error) => {
        setPlayer({})
      });
  }

  const handleChangeImageDisplay = (event: any) => {
    setDisplay({ ...display, imageDisplay: event.target.value });
  }

  const handleChangeImageIsDisplayed = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisplay({ ...display, imageIsDisplay: event.target.checked });
  }

  const handleChangeDisplayArtist = (event: any) => {
    setDisplay({ ...display, displayArtist: event.target.checked });
  }

  const handleChangeDisplayTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisplay({ ...display, displayTitle: event.target.checked });
  }

  const handleChangeArtistSize = (event: any, value: any) => {
    setDisplay({ ...display, artistSize: value });
  }

  const handleChangeTitleSize = (event: any, value: any) => {
    setDisplay({ ...display, titleSize: value });
  }

  const handleChangeTextColor = (event: any) => {
    setDisplay({ ...display, textColor: event.target.value });
  }

  const handleChangeBackgroundColor = (event: any) => {
    setDisplay({ ...display, backgroundColor: event.target.value });
  }

  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        getCurrentlyPlaying(token);
      }, 1000)
      getCurrentlyPlaying(token);

      return () => clearInterval(interval);
    }
  }, [token]);

  let animationTime = '5s';

  interface Props {
    children: React.ReactElement;
    open: boolean;
    value: number;
  }

  const ValueLabelComponent = (props: Props) => {
    const { children, open, value } = props;

    return (
      <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box
          sx={{
            paddingRight: theme.spacing(8),
            display: 'flex',
            flexDirection: matches ? 'row' : 'column',
            justifyItems: 'center',
            alignItems: matches ? 'center' : 'stretch',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: display.backgroundColor,
          }}
        >
          {/* {!token && (
            <Link
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </Link>
          )} */}
          {!token && (
            <>
              {image && display.imageIsDisplay &&
                <Box sx={{ flex: '1 0 30%' }}>
                  {display.imageDisplay === 'vinyl' && <RotateVinyl image={image} animationTime={animationTime} />}
                  {display.imageDisplay === 'vinylSleeve' && <VinylSleeve image={image} animationTime={animationTime} />}
                  {display.imageDisplay === 'simple' && <Box sx={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'contain',
                    height: '400px',
                    width: '400px',
                  }} />}
                </Box>
              }
              <Box>
                {display.displayArtist && <Typography component="span" sx={{ fontSize: `${display.artistSize}vmax`, color: display.textColor, fontWeight: 'bold', lineHeight: 1, }}>{artists}<br /></Typography>}
                {display.displayTitle && <Typography component="span" sx={{ fontSize: `${display.titleSize}vmax`, color: display.textColor, fontWeight: 'bold', lineHeight: 1 }}>{title}</Typography>}
              </Box>
            </>
          )}

        </Box>
        <Fab
          aria-label="open drawer"
          size="small"
          onClick={handleDrawerOpen}
          sx={{
            display: open ? 'none' : 'innerit',
            position: 'fixed',
            top: theme.spacing(2),
            right: theme.spacing(2),
          }}
        >
          <MenuIcon />
        </Fab>
        <Drawer
          variant="persistent"
          anchor="right"
          open={open}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
          }}
        >
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-start',
          }}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Box>
          <Box sx={{
            padding: theme.spacing(0, 3, 0, 3),
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Typography component="h3">Background</Typography>
            <TextField required label="Color" onChange={handleChangeBackgroundColor} defaultValue={display.backgroundColor} />

            <Divider />

            <Typography component="h3">Image</Typography>
            <FormControlLabel
              control={<Switch checked={display.imageIsDisplay}
                onChange={handleChangeImageIsDisplayed}
                name="displayImage"
                color="primary" />}
              label="Display image"
            />
            <FormControl sx={{
              margin: theme.spacing(1),
              minWidth: 120,
            }}>
              <InputLabel id="selectLabel">Image Display</InputLabel>
              <Select
                labelId="selectLabel"
                id="select"
                value={display.imageDisplay}
                onChange={handleChangeImageDisplay}>
                <MenuItem value="vinyl">Rotating vinyl</MenuItem>
                <MenuItem value="vinylSleeve">Vinyl sleeve</MenuItem>
                <MenuItem value="simple">Simple Image</MenuItem>
              </Select>
            </FormControl>
            <Divider />
            <Typography component="h3">Text</Typography>
            <TextField required label="Color" onChange={handleChangeTextColor} defaultValue={display.textColor} />
            <FormControlLabel
              control={<Switch checked={display.displayArtist}
                onChange={handleChangeDisplayArtist}
                name="displayImage"
                color="primary" />}
              label="Display artist"
            />
            <Typography gutterBottom>Artist Size</Typography>
            <Slider
              onChangeCommitted={handleChangeArtistSize}
              aria-label="Artist Size"
              min={3}
              max={10}
              defaultValue={display.artistSize}
            />
            <FormControlLabel
              control={<Switch checked={display.displayTitle}
                onChange={handleChangeDisplayTitle}
                name="tempoMove"
                color="primary" />}
              label="Display title"
            />
            <Typography gutterBottom>Title Size</Typography>
            <Slider
              onChangeCommitted={handleChangeTitleSize}
              aria-label="Title Size"
              min={3}
              max={10}
              defaultValue={display.titleSize}
            />
          </Box>
        </Drawer>
      </Container>
    </ThemeProvider >
  );
}

export default App;
