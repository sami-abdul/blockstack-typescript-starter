import * as blockstack from 'blockstack';
import * as React from 'react';
import './App.css';
import UserInfo from './UserInfo';

interface IProps {
    name?: string;
}

interface IState {
    isSignedIn: boolean;
    person?: any;
}

class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const isSignedIn = this.checkSignedInStatus();

        this.state = {
            isSignedIn,
            person: undefined
        };

        if(isSignedIn) {
            this.loadPerson();
        }

        this.handleSignIn = this.handleSignIn.bind(this)
        this.handleSignOut = this.handleSignOut.bind(this)
    }

    public checkSignedInStatus(): boolean {
        if (blockstack.isUserSignedIn()) {
            return true;
        } else if (blockstack.isSignInPending()) {
            blockstack.handlePendingSignIn().then((userData: any) => {
                window.location.href = window.location.origin
            });
            return false;
        }
        return false
    }

    public loadPerson() {
        const username = blockstack.loadUserData().username;

        blockstack.lookupProfile(username).then((person: any) => {
            this.setState({ person })
        })
    }

    public handleSignIn() {
        blockstack.redirectToSignIn()
    }

    public handleSignOut() {
        blockstack.signUserOut(window.location.href)
    }

    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Blockstack Create React App</h1>
                </header>
                <p style={{display: this.state.isSignedIn ? 'none' : 'block' }}>
                    <button onClick={this.handleSignIn}>
                        Sign-in with Blockstack
                    </button>
                </p>
                <p style={{display: !this.state.isSignedIn ? 'none' : 'block' }}>
                    <UserInfo user={this.state.person} />
                    <button onClick={this.handleSignOut}>
                        Sign-out
                    </button>
                </p>
            </div>
        )
    }
}

export default App;
