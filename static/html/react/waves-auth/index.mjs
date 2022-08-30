import componentApp from './App.mjs';
import componentNavbar from './components/layout/Navbar.mjs';
import componentFooter from './components/layout/Footer.mjs';
import componentLanding from './components/layout/Landing.mjs';
import componentNotFound from './components/not-found/NotFound.mjs';
import componentPrivateRoute from './components/common/PrivateRoute.mjs';
import componentRegister from './components/auth/Register.mjs';
import componentLogin from './components/auth/Login.mjs';
import componentProfiles from './components/profiles/Profiles.mjs';
import componentProfile from './components/profile/Profile.mjs';
import componentDashboard from './components/dashboard/Dashboard.mjs';
import componentEditProfile from './components/edit-profile/EditProfile.mjs';
import componentCreateProfile from './components/create-profile/CreateProfile.mjs';
import componentPosts from './components/posts/Posts.mjs';
import componentPost from './components/post/Post.mjs';
import componentAddExperience from './components/add-credentials/AddExperience.mjs';
import componentAddEducation from './components/add-credentials/AddEducation.mjs';
import componentTextFieldGroup from './components/common/TextFieldGroup.mjs';

export default  (obj) => {
    return new Promise(function (resolve, reject) {
        bundle['default'](obj,null, async function (error, config) {
            const mountPoint = document.createElement('div')
            mountPoint.style.overflow = "hidden";
            let store = config['store']
            let Component = config['Component']
            let Provider = config['Provider']
            let Router = config['Router']
            let Route = config['Route']
            let Switch = config['Switch']
            let React = config['React']
            let ReactDOM = config['ReactDOM']
            let App = await componentApp('App')
            let Navbar = await componentNavbar('Navbar')
            let Footer = await componentFooter('Footer')
            let Landing = await componentLanding('landing')
            let NotFound = await componentNotFound('NotFound')
            let PrivateRoute = await componentPrivateRoute('PrivateRoute')
            let Register = await componentRegister('Register')
            let Login = await componentLogin('Login')
            let Profiles = await componentProfiles('Profiles')
            let Profile = await componentProfile('Profile')
            let EditProfile = await componentEditProfile('EditProfile')
            let CreateProfile = await componentCreateProfile('CreateProfile')
            let Posts = await componentPosts('Posts')
            let Post = await componentPost('Post')
            let Dashboard = await componentDashboard('Dashboard')
            let AddExperience = await componentAddExperience('AddExperience')
            let AddEducation = await componentAddEducation('AddEducation')
            let TextFieldGroup = await componentTextFieldGroup('TextFieldGroup')
            let retargetEvents =  config['retargetEvents']
            if (localStorage.jwtToken) {
                setAuthToken(localStorage.jwtToken);
                const decoded = jwt_decode(localStorage.jwtToken);
                store.dispatch(setCurrentUser(decoded));
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    store.dispatch(logoutUser());
                    store.dispatch(clearCurrentProfile());
                    window.location.href = '/login';
                }
            }
            let index = config['babel']['transform'](`
                 ${App}
                 retargetEvents(mountPoint)
                 ReactDOM.render(<App />,mountPoint);
             `,config['babel']['availablePresets']['react'])
            eval(index.code)
            resolve(mountPoint)
        })})}