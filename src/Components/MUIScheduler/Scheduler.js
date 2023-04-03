import React, { useState, useCallback } from "react";
import { createTheme, Pivot, PivotItem, ThemeProvider } from "@fluentui/react";
import "./styles.css";
import Calendar from "./Calendar";
import List from "./List";
import { data } from "./data";

const myTheme = createTheme({
  palette: {
    themePrimary: "#0078d4",
    themeLighterAlt: "#eff6fc",
    themeLighter: "#deecf9",
    themeLight: "#c7e0f4",
    themeTertiary: "#71afe5",
    themeSecondary: "#2b88d8",
    themeDarkAlt: "#106ebe",
    themeDark: "#005a9e",
    themeDarker: "#004578",
    neutralLighterAlt: "#faf9f8",
    neutralLighter: "#f3f2f1",
    neutralLight: "#edebe9",
    neutralQuaternaryAlt: "#e1dfdd",
    neutralQuaternary: "#d0d0d0",
    neutralTertiaryAlt: "#c8c6c4",
    neutralTertiary: "#a19f9d",
    neutralSecondary: "#605e5c",
    neutralPrimaryAlt: "#3b3a39",
    neutralPrimary: "#323130",
    neutralDark: "#201f1e",
    black: "#000000",
    white: "#ffffff"
  }
});

export default function App() {
  return (
    <ThemeProvider applyTo="body" theme={myTheme}>
      <Pivot>
        <PivotItem headerText="Calendar">
          <Calendar data={data} />
        </PivotItem>
        <PivotItem headerText="List">
          <List data={data} />
        </PivotItem>
      </Pivot>
    </ThemeProvider>
  );
}
