"use_strict";
/* eslint-disable no-use-before-define */
import * as THREE from "three";
THREE.Object3D.prototype.lookAt = (function () {
  var q1 = new THREE.Quaternion();
  var m1 = new THREE.Matrix4();
  var vector = new THREE.Vector3();
  var target = new THREE.Vector3();
  var position = new THREE.Vector3();

  return function lookAt(x, y, z) {
    if (x.isVector3) {
      target.copy(x);
    } else {
      target.set(x, y, z);
    }

    this.updateMatrix();
    position.setFromMatrixPosition(this.matrix);

    if (this.isCamera) {
      m1.lookAt(position, target, this.up);
    } else {
      m1.lookAt(target, position, this.up);
    }

    this.quaternion.setFromRotationMatrix(m1);
  };
})();
THREE.Object3D.prototype.updateWorldMatrix = function (updateParents, updateChildren) {
  var parent = this.parent;

  if (updateParents === true && parent !== null) {
    parent.updateWorldMatrix(true, false);
  }

  if (this.matrixAutoUpdate) this.updateMatrix();

  if (this.parent === null) {
    this.matrixWorld.copy(this.matrix);
  } else {
    this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
  }

  // update children

  if (updateChildren === true) {
    var children = this.children;

    for (var i = 0, l = children.length; i < l; i++) {
      children[i].updateWorldMatrix(false, true);
    }
  }
};
/* @ts-expect-error */
THREE.Object3D.prototype.lookAtObject3D = (function () {
  var m1 = new THREE.Matrix4();
  var position = new THREE.Vector3();
  var parentMatrix;

  return function lookAtObject3D(object) {
    object.updateWorldMatrix(true, false);
    if (this.parent) {
      this.parent.updateWorldMatrix(true, false);
      parentMatrix = this.parent.matrixWorld;
    } else {
      parentMatrix = m1.identity();
    }
    /* @ts-expect-error */
    m1.getInverse(parentMatrix).multiply(object.matrixWorld);
    position.setFromMatrixPosition(m1);
    this.lookAt(position);
  };
})();
