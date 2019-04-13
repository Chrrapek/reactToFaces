import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin'
import Clarifai from 'clarifai'
import Particles from "react-particles-js";
import Register from "./components/Register/Register";

const app = new Clarifai.App({
    apiKey: 'ffcb55ca585f499d9d1d3cd03a14dc52'
});

const params = {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800
            }
        }
    }
};

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'signin',
            isSignedIn: false
        }
    }

    onInputChange = (event) => {
        this.setState({input: event.target.value})
    };

    calculateFaceLocation = (data) => {
        const clarifyData = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputImage');
        const width = Number(image.width);
        const height = Number(image.height);

        return {
            leftCol: clarifyData.left_col * width,
            rightCol: width - (clarifyData.right_col * width),
            topRow: clarifyData.top_row * height,
            bottomRow: height - (clarifyData.bottom_row * height)
        }
    };

    displayFaceBox = (box) => {
        this.setState({box});
    };

    onSubmit = () => {
        this.setState({imageUrl: this.state.input});
        app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
            .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
            .catch(err => console.log(err))
    };

    onRouteChange = (route) => {
        if (route === 'signout') {
            this.setState({isSignedIn: false})
        } else if (route === 'home') {
            this.setState({isSignedIn: true})
        }
        this.setState({route: route});
    };

    render() {
        return (
            <div className="App">
                <Particles
                    className='particles'
                    params={params}/>
                <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
                {this.state.route === 'home' ?
                    <div>
                        <Logo/>
                        <Rank/>
                        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onSubmit}/>
                        <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
                    </div>
                    : (
                        this.state.route === 'signin'
                            ? <Signin onRouteChange={this.onRouteChange}/>
                            : <Register onRouteChange={this.onRouteChange}/>
                    )}
            </div>
        );
    }
}

export default App;
