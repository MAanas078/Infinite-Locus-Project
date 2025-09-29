import React from "react";
import { Stack } from '@mui/material'
import Navbar from "./Components/Navbar.js";
import Footer from "./Components/footer.js";

function Layout(props) {
  return (
    <Stack
      spacing={0}
      width="100%"
      alignItems="center"
      minHeight="100vh"        // ✅ allow more height if needed
    >
      <Navbar />

      {/* Main content expands */}
      <Stack flexGrow={1} width="100%">
        {props.children}
      </Stack>

      <Footer />
    </Stack>
  );
}

export default Layout;
