import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {makeStyles, Theme, createStyles, createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { blue, purple } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import 'typeface-roboto';

import RotateVinyl from "./RotateVinyl";
import VinylSleeve from "./VinylSleeve";

import './App.css';
export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = 'b347d2ec2383419280774a3b67326182';
const clientSecret = 'b540f1d67f9841338a6d509df8b85c77';
const redirectUri = 'http://localhost:3000';
const scopes = [
    "user-read-currently-playing",
    "user-read-playback-state",
];
// Get the hash of the url
const hash = window.location.hash
    .substring(1)
    .split("&")
    .reduce(function (initial: any, item: string) {
        if (item) {
            let parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
window.location.hash = "";

const drawerWidth = 400;

const theme = createMuiTheme({
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: drawerWidth,
        },
        toolBar: {
            justifyContent: 'flex-end',
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerContent: {
            padding: theme.spacing(0, 3, 0, 3),
            display: 'flex',
            flexDirection: 'column',
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-start',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            display: 'flex',
            flexDirection: 'column',
            justifyItems: 'center',
            alignItems: 'center',
            height: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: 0,
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        simpleImage: {
            backgroundSize: 'contain',
            height: '400px',
            width: '400px',
        },
        artist: {
            fontWeight: 'bold',
            lineHeight: 1,
        },
        title: {
            fontWeight: 'bold',
            lineHeight: 1,
        },
    }),
);

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

function App() {
    const classes = useStyles();
    const [token, setToken] = useState<string|null>();

    const [display, setDisplay] = useState<Display>({
        backgroundColor: '#00FF00',
        imageDisplay: 'vinyl',
        imageIsDisplay: true,
        textColor: '#FFFFFF',
        titleSize: 80,
        displayTitle: true,
        artistSize: 75,
        displayArtist: true,
    })

    const [player, setPlayer] = useState<Player>({
        image: 'https://i.scdn.co/image/ab67616d0000b2730a9a606015c3eda4843520bd',
        title: 'You Spin Me Round (Like a Record)',
        artists: 'Dead or Alive',
    });
    const {title, artists, image} = player;
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        let _token = hash.access_token;
        if (_token) {
            // Set token
            setToken(_token);

        }
    }, []);

    function getCurrentlyPlaying(token: string) {
        fetch("https://api.spotify.com/v1/me/player", {
            method: 'GET',
            mode: 'cors',
            headers:  {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            setPlayer({
                image: data.item.album.images[0].url,
                artists: Array.isArray(data.item.artists)
                    ? data.item.artists.map((artist: any) => {return artist.name}).join(', ')
                    : data.item.artists.name,
                title: data.item.name,
            })
        }).catch(function(error) {
            setPlayer({})
        });
    }

    function handleChangeImageDisplay(event: any) {
        setDisplay({...display, imageDisplay: event.target.value});
    }

    function handleChangeImageIsDisplayed(event: React.ChangeEvent<HTMLInputElement>) {
        setDisplay({...display, imageIsDisplay: event.target.checked});
    }

    function handleChangeDisplayArtist(event: any) {
        setDisplay({...display, displayArtist: event.target.checked});
    }

    function handleChangeDisplayTitle(event: React.ChangeEvent<HTMLInputElement>) {
        setDisplay({...display, displayTitle: event.target.checked});
    }

    function handleChangeArtistSize(event: any, value: any) {
        setDisplay({...display, artistSize: value});
    }

    function handleChangeTitleSize(event: any, value: any) {
        setDisplay({...display, titleSize: value});
    }

    function handleChangeTextColor(event: any) {
        setDisplay({...display, textColor: event.target.value});
    }

    function handleChangeBackgroundColor(event: any) {
        setDisplay({...display, backgroundColor: event.target.value});
    }

    useEffect(() => {
        if (token) {
            setInterval(() => {
                getCurrentlyPlaying(token);
            }, 1000)
            getCurrentlyPlaying(token);
        }
    }, [token]);

    let animationTime = '5s';

    interface Props {
        children: React.ReactElement;
        open: boolean;
        value: number;
    }

    function ValueLabelComponent(props: Props) {
        const { children, open, value } = props;

        return (
            <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
                {children}
            </Tooltip>
        );
    }

    return (
        <MuiThemeProvider theme={theme}>
            <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar className={classes.toolBar}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerOpen}
                        className={clsx(open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
                style={{backgroundColor: display.backgroundColor}}
            >
                <div className={classes.drawerHeader} />
                {!token && (
                    <a
                        className="btn btn--loginApp-link"
                        href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
                    >
                        Login to Spotify
                    </a>
                )}
                {image && display.imageIsDisplay && (
                    <>
                        {display.imageDisplay === 'vinyl' && <RotateVinyl image={image} animationTime={animationTime} />}
                        {display.imageDisplay === 'vinylSleeve' && <VinylSleeve image={image} animationTime={animationTime} />}
                        {display.imageDisplay === 'simple' && <div className={classes.simpleImage} style={{backgroundImage: `url(${image})`}} />}
                    </>
               )}

                {display.displayArtist && <span className={classes.artist} style={{fontSize: `${display.artistSize}px`, color: display.textColor}}>{artists}</span>}
                {display.displayTitle && <span className={classes.title} style={{fontSize: `${display.titleSize}px`, color: display.textColor}}>{title}</span>}

            </main>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>

                <div className={classes.drawerContent}>
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
                    <FormControl className={classes.formControl}>
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
                        ValueLabelComponent={ValueLabelComponent}
                        onChangeCommitted={handleChangeArtistSize}
                        aria-label="Artist Size"
                        min={10}
                        max={80}
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
                        ValueLabelComponent={ValueLabelComponent}
                        onChangeCommitted={handleChangeTitleSize}
                        aria-label="Title Size"
                        min={10}
                        max={80}
                        defaultValue={display.titleSize}
                    />
                </div>

            </Drawer>

        </div>
        </MuiThemeProvider>
    );
}

export default App;
