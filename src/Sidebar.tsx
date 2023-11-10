import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

export function Sidebar() {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to={`/scratchy-grad/`}>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to={`/scratchy-grad/live`}>
              <ListItemText primary="Live Grad" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to={`/scratchy-grad/mnist`}>
              <ListItemText primary="MNIST" />
            </ListItemButton>
          </ListItem>
      </List>
    </Drawer>
  );
}