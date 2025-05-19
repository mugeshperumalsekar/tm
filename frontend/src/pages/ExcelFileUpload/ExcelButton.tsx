import React from "react";
import { Button, Space } from "antd";
import { Box } from "@mui/material";
import Header from "../../layouts/header/header";

const ExcelButton: React.FC = () => {

  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: 5 }}>
        <Space direction="horizontal" size="middle">
          <Button type="primary">Primary</Button>
          <Button type="primary">Default</Button>
          <Button type="primary">Dashed</Button>
          <Button type="primary">Text</Button>
          <Button type="primary">Link</Button>
        </Space>
      </Box>
    </Box>
  );
};

export default ExcelButton;