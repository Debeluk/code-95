import { LoginPage } from './login.jsx';
import { Header } from './header.jsx';
import { Courses } from './courses.jsx';
import { TicketsPage } from './tickets.jsx';
import { FormedTest } from './formedTest.jsx';
import { Admin } from './admin.jsx';
import { UserInfo } from './userInfo.jsx';

export const App = () => {
    return (
        <>
            <Header></Header>
            <LoginPage></LoginPage>
            <Courses></Courses>
            <TicketsPage></TicketsPage>
            <FormedTest></FormedTest>
            <Admin></Admin>
            <UserInfo></UserInfo>
            <style>
                {`
          body {
            background-color: #eaeaea;
            margin: 0;
            padding: 0;
          }
        `}
            </style>
        </>
    );
};
