<script lang="ts">
	import { useThrelte } from "@threlte/core";
	import { BoxGeometry, InstancedMesh, MeshBasicMaterial, Object3D } from "three";

  let starMat = new MeshBasicMaterial({color:"#fff"})
  let instances: InstancedMesh[] = [new InstancedMesh(new BoxGeometry(0.2,0.2,0.2),starMat,300),
                                    new InstancedMesh(new BoxGeometry(0.5,0.5,0.5),starMat,100),
                                    new InstancedMesh(new BoxGeometry(1.5,1.5,1.5),starMat,50)]

  let dummy = new Object3D()
  let index = 0
  
  const {scene} = useThrelte()
  $:{
    if(scene){
      instances.forEach((instance)=>{
        scene.add(instance)
        for(let i = 0; i < instance.count; i++){
          let x = ((Math.random() * 100) + 90) * ((Math.random() - 0.5) * 2)
          let y = ((Math.random() * 100) + 90) * ((Math.random() - 0.5) * 2)
          let z = ((Math.random() * 100) + 90) * ((Math.random() - 0.5) * 2)
          dummy.position.set(x,y,z)
          dummy.updateMatrix()
          instance.setMatrixAt(index,dummy.matrix)
          index++
        }
      })
    }
  }
</script>