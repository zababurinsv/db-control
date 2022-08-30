export default  (obj) => {
  return new Promise(async function (resolve, reject) {
    bundle['default'](obj,null, async function (error, config) {
    let template = config['babel']['transform'](` 
    let setAuthToken = config['setAuthToken']
    let React = config['React']
    let Component = config['Component']
    let Router =   config['Router']   
    let Route =   config['Route']
    let Switch =   config['Switch']
    let jwt_decode =   config['jwt_decode']
    let setCurrentUser = config['actions']['authActions']['setCurrentUser']
    let clearCurrentProfile = config['actions']['profileActions']['clearCurrentProfile']
    class App extends Component {
        render() {
          return (
        <Provider store={store}>
        <Router>
            <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
                <Route exact path="/profiles" component={Profiles} />
                <Route exact path="/profile/:handle" component={Profile} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/create-profile"
                  component={CreateProfile}/>
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/edit-profile"
                  component={EditProfile}/>
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-experience"
                  component={AddExperience}/>
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-education"
                  component={AddEducation}/>
              </Switch>
              <Switch>
                <PrivateRoute exact path="/feed" component={Posts} />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/post/:id" component={Post} />
              </Switch>
              <Route exact path="/not-found" component={NotFound} />
             </div>
            <Footer />
          </div>
        </Router>
      </Provider>
          );
        }
      }
       resolve(App)
            `,config['babel']['availablePresets']['react'])
      eval(template.code)




    })})}


