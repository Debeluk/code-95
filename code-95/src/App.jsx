import { LoginPage } from './components/login';
import { Header } from './components/header';
import { Courses } from './components/courses';
import { TicketsPage } from './components/tickets';
import { FormedTest } from './components/formedTest';
import { Admin } from './components/admin';
import { UserInfo } from './components/userInfo';

const App = () => {
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

export default App;
