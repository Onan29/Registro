const {useState,useRef,useCallback,useEffect}=React;

const SUPABASE_URL = 'https://zjqkeyecaoaecxrxyzad.supabase.co';

const SUPABASE_ANON_KEY = 'sb_publishable_T8I2EiMPiTO6OGQhWhmqpA_2EsnMTYd';

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
console.log("SUPABASE OK", supabase);

const SPANISH_UPPER=/^[A-ZÁÉÍÓÚÑÜ]*$/;
const CEDULA_CHARS=/^[\d\-]*$/;

function redLine(){return React.createElement('div',{style:{height:2,background:'linear-gradient(90deg,#E50914 0%,#ff4d4d 50%,transparent 100%)',marginBottom:24,borderRadius:2}})}

function Field({label,hint,hintType='info',children}){
  return React.createElement('div',{className:'field'},
    React.createElement('label',null,label),
    children,
    hint&&React.createElement('p',{className:`hint ${hintType}`},hint)
  )
}

function TextInput({value,onChange,placeholder,type='text',className='',rightEl,style={}}){
  return React.createElement('div',{style:{position:'relative'}},
    React.createElement('input',{type,value,onChange,placeholder,className,style:{paddingRight:rightEl?'40px':undefined,...style}}),
    rightEl
  )
}

function calcAge(dob){
  if(!dob||dob.length!==10)return null;
  const [d,m,y]=dob.split('/').map(Number);
  if(!d||!m||!y||y<1900||y>2099||m<1||m>12||d<1||d>31)return null;
  const bd=new Date(y,m-1,d);
  if(bd.getMonth()!==m-1)return null;
  const today=new Date();
  let age=today.getFullYear()-bd.getFullYear();
  const moD=today.getMonth()-bd.getMonth();
  if(moD<0||(moD===0&&today.getDate()<bd.getDate()))age--;
  return age>=0&&age<=130?age:null;
}

function formatDOB(raw){
  const digits=raw.replace(/\D/g,'').slice(0,8);
  let out='';
  for(let i=0;i<digits.length;i++){
    if(i===2||i===4)out+='/';
    out+=digits[i];
  }
  return out;
}

function passStrength(p){
  if(!p)return{w:0,c:'#333',t:''};
  let s=0;
  if(p.length>=8)s++;if(p.length>=12)s++;
  if(/[A-Z]/.test(p))s++;if(/[0-9]/.test(p))s++;if(/[^A-Za-z0-9]/.test(p))s++;
  if(s<=1)return{w:25,c:'#e74c3c',t:'Muy débil'};
  if(s===2)return{w:50,c:'#e67e22',t:'Débil'};
  if(s===3)return{w:75,c:'#f1c40f',t:'Regular'};
  return{w:100,c:'#27ae60',t:'Fuerte'};
}

function PhotoUpload({label,size,preview,onFile}){
  const inp=useRef();
  const [drag,setDrag]=useState(false);
  const handle=e=>{
    const f=e.target.files[0];
    if(f&&f.type.startsWith('image/')){
      const r=new FileReader();
      r.onload=ev=>onFile(ev.target.result);
      r.readAsDataURL(f);
    }
  };
  return React.createElement('div',null,
    React.createElement('div',{className:'photo-box',style:{width:size.w,height:size.h,background:drag?'#1a1a1a':'#0f0f0f',borderColor:drag?'#E50914':undefined},
      onDragOver:e=>{e.preventDefault();setDrag(true)},
      onDragLeave:()=>setDrag(false),
      onDrop:e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f&&f.type.startsWith('image/')){const r=new FileReader();r.onload=ev=>onFile(ev.target.result);r.readAsDataURL(f)}}
    },
      preview?React.createElement('img',{src:preview,className:'photo-preview',alt:'preview'}):
      React.createElement('div',{style:{textAlign:'center',pointerEvents:'none',padding:'12px'}},
        React.createElement('div',{style:{fontSize:'1.4rem',color:'#333',marginBottom:4}},'＋'),
        React.createElement('div',{style:{fontSize:'0.6rem',letterSpacing:2,color:'#444',textTransform:'uppercase'}}),
      ),
      React.createElement('input',{type:'file',ref:inp,accept:'image/*',onChange:handle})
    ),
    React.createElement('p',{className:'upload-label',style:{marginTop:6}},label)
  )
}

function DocUpload({docType,preview,onFile}){
  const inp=useRef();
  const [drag,setDrag]=useState(false);
  const accept=docType==='cedula'?'image/*':'image/*';
  const handle=e=>{
    const f=e.target.files[0];
    if(f){const r=new FileReader();r.onload=ev=>onFile(ev.target.result);r.readAsDataURL(f);}
  };
  return React.createElement('div',{
    className:'photo-box',
    style:{width:'100%',height:110,background:drag?'#1a0a0a':'#0f0f0f',borderColor:drag?'#E50914':undefined},
    onDragOver:e=>{e.preventDefault();setDrag(true)},
    onDragLeave:()=>setDrag(false),
    onDrop:e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f){const r=new FileReader();r.onload=ev=>onFile(ev.target.result);r.readAsDataURL(f);}}
  },
    preview?React.createElement('img',{src:preview,className:'photo-preview',alt:'doc preview'}):
    React.createElement('div',{style:{textAlign:'center',pointerEvents:'none'}},
      React.createElement('div',{style:{fontSize:'1.6rem',color:'#333'}},'📎'),
      React.createElement('p',{style:{fontSize:'0.6rem',letterSpacing:2,color:'#444',textTransform:'uppercase',marginTop:4}}),
      React.createElement('p',{style:{fontSize:'0.58rem',color:'#2a2a2a',marginTop:3}}),
    ),
    React.createElement('input',{type:'file',ref:inp,accept,onChange:handle})
  )
}

function SuccessScreen({nombre}){
  return React.createElement('div',{className:'success-overlay'},
    React.createElement('div',{style:{fontSize:'0.6rem',letterSpacing:6,color:'#E50914',textTransform:'uppercase',marginBottom:12}},'Registro completado'),
    React.createElement('div',{style:{fontSize:'2.5rem',marginBottom:16,color:'#E50914'}},'✓'),
    React.createElement('h2',{style:{fontSize:'1.4rem',fontWeight:400,marginBottom:8}},`Bienvenido, ${nombre}`),
    React.createElement('p',{style:{fontSize:'0.78rem',color:'#666',letterSpacing:1}})
  )
}

function App(){
  const [docType,setDocType]=useState('cedula');
  const [nombre,setNombre]=useState('');
  const [apellido,setApellido]=useState('');
  const [cedula,setCedula]=useState('');
  const [correo,setCorreo]=useState('');
  const [pass,setPass]=useState('');
  const [pass2,setPass2]=useState('');
  const [showP,setShowP]=useState(false);
  const [showP2,setShowP2]=useState(false);
  const [dob,setDob]=useState('');
  const [photoUser,setPhotoUser]=useState(null);
  const [photoDoc,setPhotoDoc]=useState(null);
  const [submitted,setSubmitted]=useState(false);
  const [errors,setErrors]=useState({});
  const [touched,setTouched]=useState({});

  const age=calcAge(dob);
  const strength=passStrength(pass);

  const blur=k=>setTouched(t=>({...t,[k]:true}));

  const validate=useCallback(()=>{
    const e={};
    if(!nombre.trim())e.nombre='Nombre requerido';
    else if(nombre.trim().length<2)e.nombre='Mínimo 2 caracteres';
    if(!apellido.trim())e.apellido='Apellido requerido';
    else if(apellido.trim().length<2)e.apellido='Mínimo 2 caracteres';
    if(!cedula.trim())e.cedula=docType==='cedula'?'Cédula requerida':'Pasaporte requerido';
    else if(docType==='cedula'&&!CEDULA_CHARS.test(cedula))e.cedula='Solo números y guiones';
    else if(docType==='cedula'&&cedula.length<6)e.cedula='Mínimo 6 caracteres';
    else if(docType==='pasaporte'&&!SPANISH_UPPER.test(cedula))e.cedula='Solo letras mayúsculas (A-Z, Ñ)';
    else if(docType==='pasaporte'&&cedula.length<5)e.cedula='Mínimo 5 caracteres';
    if(!correo.trim())e.correo='Correo requerido';
    else if(!correo.includes('@')||!correo.includes('.'))e.correo='Debe contener "@" y "."';
    else if(correo.indexOf('@')===0)e.correo='Falta el nombre antes del "@"';
    if(!pass)e.pass='Contraseña requerida';
    else if(pass.length<8)e.pass='Mínimo 8 caracteres';
    if(!pass2)e.pass2='Confirma tu contraseña';
    else if(pass!==pass2)e.pass2='Las contraseñas no coinciden';
    if(!dob||dob.length<10)e.dob='Fecha requerida (dd/mm/yyyy)';
    else{const a=calcAge(dob);if(a===null)e.dob='Fecha inválida';else if(a<13)e.dob='Debes tener al menos 13 años';}
    return e;
  },[nombre,apellido,cedula,docType,correo,pass,pass2,dob]);

  const allErrors=validate();
  const isValid=Object.keys(allErrors).length===0;

  const handleCedula=e=>{
    const val=e.target.value;
    if(docType==='cedula'){if(CEDULA_CHARS.test(val))setCedula(val);}
    else{const up=val.toUpperCase().replace(/[^A-ZÁÉÍÓÚÑÜ]/g,'');setCedula(up);}
  };

  const handleNombre=e=>setNombre(e.target.value.replace(/[^a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s'-]/g,''));
  const handleApellido=e=>setApellido(e.target.value.replace(/[^a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s'-]/g,''));

  const handleCorreo=e=>{
    const v=e.target.value.replace(/\s/g,'');
    setCorreo(v);
  };

  const handleDOB=e=>setDob(formatDOB(e.target.value));

  const handleDocToggle=t=>{setDocType(t);setCedula('');setErrors({});};

  const submit = async () => {

  setTouched({
    nombre:1,
    apellido:1,
    cedula:1,
    correo:1,
    pass:1,
    pass2:1,
    dob:1
  });

  if(!isValid) return;

  try {

    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        {
          nombre: nombre,
          apellido: apellido,
          documento: cedula,
          tipo_documento: docType,
          correo: correo,
          fecha_nacimiento: dob,
          foto_perfil: photoUser,
          foto_documento: photoDoc
        }
      ]);

    if(error){
      console.error(error);
      alert('Error guardando usuario');
      return;
    }

    console.log('Usuario guardado:', data);

    setSubmitted(true);

  } catch(err){
    console.error(err);
    alert('Error inesperado');
  }
};

  const fStatus=(k)=>{
    if(!touched[k])return '';
    return allErrors[k]?'error':'ok';
  };

  if(submitted)return React.createElement(SuccessScreen,{nombre});

  return React.createElement('div',{style:{maxWidth:860,margin:'0 auto',padding:'32px 20px 48px'}},
    React.createElement('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}},
      React.createElement('div',null,
        React.createElement('div',{style:{fontSize:'1.8rem',fontWeight:700,letterSpacing:'-2px',color:'#E50914'}},'STREAM',
          React.createElement('span',{style:{fontSize:'0.5rem',letterSpacing:'6px',color:'#666',display:'block',marginTop:-2,textTransform:'uppercase'}},'Premium')
        )
      ),
      React.createElement('div',{style:{fontSize:'0.62rem',letterSpacing:3,color:'#444',textTransform:'uppercase'}},'Crear cuenta')
    ),

    React.createElement('div',{style:{height:2,background:'linear-gradient(90deg,#E50914,#ff4d4d 50%,transparent)',marginBottom:28,borderRadius:2}}),

    React.createElement('div',{style:{display:'flex',gap:32}},

      // LEFT COLUMN
      React.createElement('div',{style:{flex:1,minWidth:0}},
        React.createElement('p',{className:'section-title'},'Datos personales'),

        // Nombre
        React.createElement(Field,{label:'Nombre',hint:touched.nombre&&allErrors.nombre||(!touched.nombre?'Solo letras y espacios':'Nombre válido ✓'),hintType:touched.nombre?(allErrors.nombre?'err':'ok'):'info'},
          React.createElement('input',{type:'text',value:nombre,onChange:handleNombre,onBlur:()=>blur('nombre'),placeholder:'Ej: Carlos',className:fStatus('nombre'),maxLength:50})
        ),

        // Apellido
        React.createElement(Field,{label:'Apellido',hint:touched.apellido&&allErrors.apellido||(!touched.apellido?'Solo letras y espacios':'Apellido válido ✓'),hintType:touched.apellido?(allErrors.apellido?'err':'ok'):'info'},
          React.createElement('input',{type:'text',value:apellido,onChange:handleApellido,onBlur:()=>blur('apellido'),placeholder:'Ej: Rodríguez',className:fStatus('apellido'),maxLength:50})
        ),

        // Doc type toggle
        React.createElement(Field,{label:'Tipo de documento',
          hint:touched.cedula&&allErrors.cedula||(docType==='cedula'?'Solo dígitos (0-9) y guiones (-)':'Solo letras mayúsculas del alfabeto español'),
          hintType:touched.cedula?(allErrors.cedula?'err':'ok'):'info'},
          React.createElement('div',{className:'toggle-doc',style:{marginBottom:8}},
            React.createElement('button',{className:docType==='cedula'?'active':'',onClick:()=>handleDocToggle('cedula')},'Cédula'),
            React.createElement('button',{className:docType==='pasaporte'?'active':'',onClick:()=>handleDocToggle('pasaporte')},'Pasaporte')
          ),
          React.createElement('input',{
            type:'text',value:cedula,
            onChange:handleCedula,
            onBlur:()=>blur('cedula'),
            placeholder:docType==='cedula'?'Ej: 8-123-456':'Ej: AB12345',
            className:fStatus('cedula'),
            maxLength:docType==='cedula'?15:12,
            style:{letterSpacing:docType==='cedula'?1:3,fontFamily:'monospace'}
          })
        ),

        // Correo
        React.createElement(Field,{label:'Correo electrónico',hint:touched.correo&&allErrors.correo||(!touched.correo?'Debe contener @ y punto':'Correo válido ✓'),hintType:touched.correo?(allErrors.correo?'err':'ok'):'info'},
          React.createElement('input',{type:'email',value:correo,onChange:handleCorreo,onBlur:()=>blur('correo'),placeholder:'usuario@correo.com',className:fStatus('correo'),maxLength:120,autoComplete:'off'})
        ),

        React.createElement('p',{className:'section-title',style:{marginTop:6}},'Seguridad'),

        // Contraseña
        React.createElement(Field,{label:'Contraseña',hint:touched.pass&&allErrors.pass||(pass?`${strength.t} — mín. 8 caracteres`:'Mínimo 8 caracteres'),hintType:touched.pass?(allErrors.pass?'err':'ok'):'info'},
          React.createElement('div',{style:{position:'relative'}},
            React.createElement('input',{type:showP?'text':'password',value:pass,onChange:e=>setPass(e.target.value),onBlur:()=>blur('pass'),placeholder:'Contraseña segura',className:fStatus('pass'),style:{paddingRight:40},autoComplete:'new-password'}),
            React.createElement('button',{className:'pass-eye',onClick:()=>setShowP(s=>!s)},showP?'●':'○')
          ),
          pass&&React.createElement('div',{style:{background:'#1a1a1a',borderRadius:3,overflow:'hidden',height:3,marginTop:6}},
            React.createElement('div',{className:'strength-bar',style:{width:`${strength.w}%`,background:strength.c,height:'100%',borderRadius:3}})
          )
        ),

        // Confirmar contraseña
        React.createElement(Field,{label:'Confirmar contraseña',hint:touched.pass2&&allErrors.pass2||(pass2&&pass===pass2?'Contraseñas coinciden ✓':'Repite la contraseña'),hintType:touched.pass2?(allErrors.pass2?'err':pass2?'ok':'info'):'info'},
          React.createElement('div',{style:{position:'relative'}},
            React.createElement('input',{type:showP2?'text':'password',value:pass2,onChange:e=>setPass2(e.target.value),onBlur:()=>blur('pass2'),placeholder:'Repite tu contraseña',className:fStatus('pass2'),style:{paddingRight:40},autoComplete:'new-password'}),
            React.createElement('button',{className:'pass-eye',onClick:()=>setShowP2(s=>!s)},showP2?'●':'○')
          )
        ),

        React.createElement('p',{className:'section-title',style:{marginTop:6}},`Imagen de ${docType==='cedula'?'cédula':'pasaporte'}`),
        React.createElement('p',{style:{fontSize:'0.62rem',color:'#444',letterSpacing:1,marginBottom:10}},
          `Sube una foto clara de tu ${docType==='cedula'?'cédula':'pasaporte'} (JPG, PNG, HEIC)`
        ),
        React.createElement(DocUpload,{docType,preview:photoDoc,onFile:setPhotoDoc})
      ),

      // SEPARATOR
      React.createElement('div',{className:'col-sep'}),

      // RIGHT COLUMN
      React.createElement('div',{style:{width:220,flexShrink:0}},
        React.createElement('p',{className:'section-title'},'Foto de perfil'),
        React.createElement('p',{style:{fontSize:'0.62rem',color:'#444',letterSpacing:1,marginBottom:12}},'Tamaño carnet (3×4 cm)'),

        React.createElement(PhotoUpload,{
          label:`${photoUser?'Cambiar foto':'Subir foto'} · Carnet`,
          size:{w:120,h:152},
          preview:photoUser,
          onFile:setPhotoUser
        }),

        React.createElement('div',{className:'divider',style:{marginTop:28}}),

        React.createElement('p',{className:'section-title'},'Fecha de nacimiento'),

        React.createElement(Field,{label:'dd / mm / yyyy',hint:touched.dob&&allErrors.dob||(!touched.dob?'Formato: 31/12/1990':''),hintType:touched.dob?(allErrors.dob?'err':'ok'):'info'},
          React.createElement('input',{
            type:'text',value:dob,
            onChange:handleDOB,
            onBlur:()=>blur('dob'),
            placeholder:'dd/mm/yyyy',
            className:fStatus('dob'),
            maxLength:10,
            inputMode:'numeric',
            style:{letterSpacing:2,fontFamily:'monospace',fontSize:'0.95rem'}
          })
        ),

        age!==null&&React.createElement('div',{className:'age-badge'},
          React.createElement('span',{style:{fontSize:'0.6rem',letterSpacing:3,color:'#E50914',textTransform:'uppercase'}},'Edad'),
          React.createElement('span',{style:{fontSize:'1.4rem',fontWeight:700,color:'#fff',fontFamily:'monospace',minWidth:32,textAlign:'center'}},age),
          React.createElement('span',{style:{fontSize:'0.6rem',letterSpacing:2,color:'#555'}},age>=18?'✓ Mayor de edad':'⚠ Menor')
        ),

        React.createElement('div',{className:'divider',style:{marginTop:28}}),

        React.createElement('button',{className:'btn-main',onClick:submit,disabled:!isValid&&Object.keys(touched).length>0},'Registrarse'),

        !isValid&&Object.keys(touched).length>0&&React.createElement('p',{style:{fontSize:'0.62rem',color:'#c0392b',textAlign:'center',marginTop:10,letterSpacing:1}},
          `${Object.keys(allErrors).length} campo${Object.keys(allErrors).length>1?'s':''} con error`
        )
      )
    )
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
