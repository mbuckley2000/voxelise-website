import React, { Component } from 'react';
import * as THREE from 'three';
import { Canvas } from 'react-three-fiber';
import { Loader } from 'semantic-ui-react';
import * as OBJLoader from 'three-obj-loader';

const largestDim = (vec) => {
  const { x, y, z } = vec;

  if (x > y && x > z) {
    return x;
  }

  if (y > z) {
    return y;
  }

  return z;
};

class MeshViewer extends Component {
    state = {
      loading: true,
      mesh: {},
    }

    componentWillMount() {
      const { url } = this.props;

      // instantiate a loader
      OBJLoader(THREE);
      const loader = new THREE.OBJLoader();

      // load a resource
      loader.load(
        // resource URL
        url,
        // called when resource is loaded
        (data) => {
          // scene.add(object);
          const mesh = data.children[0];

          // Scale mesh to be max size 1
          const box = new THREE.Box3().setFromObject(mesh);
          const size = new THREE.Vector3();
          box.getSize(size);
          const scaleFactor = 1 / largestDim(size);
          mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
          mesh.geometry.center();
          this.setState({
            loading: false,
            mesh,
          });
        },
        // called when loading is in progresses
        (xhr) => {
          // console.log(`${xhr.loaded / xhr.total * 100}% loaded`);
        },
        // called when loading has errors
        (error) => {
          console.log(error);
        },
      );
    }

    render() {
      const { loading } = this.state;
      if (loading) {
        return (
          <Loader active />
        );
      }

      return (
        <Canvas>
          <group>
            <pointLight position={[0, 5, 10]} />
            <primitive object={this.state.mesh} position={[0, 0, 4]}>
              <meshLambertMaterial attach="material" color="#fff" />
            </primitive>
          </group>
        </Canvas>
      );
    }
}

export default MeshViewer;
