import React, { useState } from 'react';
import { Layout } from 'antd';
import Header from '../header/header';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const roleId = loginDetails?.roleId;

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isAdmin = roleId === 1 || roleId === 2;
  const isClient = roleId === 3;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout className="site-layout">
        <Header />
        <Content
          style={{
            marginTop: 34,
            // marginLeft: isAdmin ? (collapsed ? 80 : 200) : 0, 
            marginLeft: 10,
            background: 'whitesmoke',
          }}
        >
          {children}
        </Content>

      </Layout>

    </Layout>
  );
};

export default AppLayout;
