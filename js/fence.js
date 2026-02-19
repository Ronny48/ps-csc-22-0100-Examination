AFRAME.registerComponent('fence-texture', {
  schema: {
    width: { type: 'number', default: 512 },
    height: { type: 'number', default: 512 },
    color: { type: 'color', default: '#8B4513' },
    repeatX: { type: 'number', default: 1 },
    repeatY: { type: 'number', default: 1 }
  },

  init: function () {
    var data = this.data;
    var el = this.el;

    // Create canvas
    var canvas = document.createElement('canvas');
    canvas.width = data.width;
    canvas.height = data.height;
    var ctx = canvas.getContext('2d');

    // Draw fence
    // Clear background (transparent)
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, data.width, data.height);

    // Draw Pickets
    var picketWidth = 40;
    var picketSpacing = 20;
    var numPickets = Math.ceil(data.width / (picketWidth + picketSpacing));
    
    ctx.fillStyle = data.color;

    for (var i = 0; i < numPickets; i++) {
        var x = i * (picketWidth + picketSpacing);
        
        // Picket body
        ctx.fillRect(x, 20, picketWidth, data.height - 20);
        
        // Picket Point
        ctx.beginPath();
        ctx.moveTo(x, 20);
        ctx.lineTo(x + picketWidth / 2, 0);
        ctx.lineTo(x + picketWidth, 20);
        ctx.fill();
    }

    // Draw Crossbars
    ctx.fillRect(0, data.height * 0.3, data.width, 30);
    ctx.fillRect(0, data.height * 0.7, data.width, 30);

    // Create texture from canvas
    var texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(data.repeatX, data.repeatY);
    
    // Apply to material
    var mesh = el.getObject3D('mesh');
    if (!mesh) {
        el.addEventListener('model-loaded', () => {
             this.applyTexture(el.getObject3D('mesh'), texture);
        });
        el.addEventListener('loaded', () => {
             this.applyTexture(el.getObject3D('mesh'), texture);
       });
    } else {
        this.applyTexture(mesh, texture);
    }
  },

  applyTexture: function(mesh, texture) {
      if (!mesh) return;
      mesh.traverse(function(node) {
          if (node.isMesh) {
              node.material.map = texture;
              node.material.transparent = true;
              node.material.alphaTest = 0.5; // Cutout transparency
              node.material.side = THREE.DoubleSide;
              node.material.needsUpdate = true;
          }
      });
  }
});
