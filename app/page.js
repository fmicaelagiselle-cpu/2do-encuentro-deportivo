// api/página.js (revisa esta función)

  const enviar = async (e) => {
    e.preventDefault()

    if (!foto) {
      alert('Debes subir una foto carnet')
      return
    }

    // --- COMIENZO DE LA COMPRESIÓN DE IMAGEN ---
    
    console.log('Comprimiendo imagen...');

    const opciones = {
      maxSizeMB: 1, 
      maxWidthOrHeight: 1024, 
      useWebWorker: true, 
      fileType: 'image/jpeg' 
    };

    let fotoAEnviar = foto; 

    try {
      const fotoComprimida = await imageCompression(foto, opciones);
      console.log(`Imagen comprimida de ${foto.size / 1024 / 1024} MB a ${fotoComprimida.size / 1024 / 1024} MB`);
      fotoAEnviar = fotoComprimida; 
    } catch (error) {
      console.error('Fallo en la compresión de imagen:', error);
      console.log('Se intentará subir la foto original.');
    }

    // --- FIN DE LA COMPRESIÓN DE IMAGEN ---

    const nombreArchivo = Date.now() + '-' + fotoAEnviar.name

    console.log('Enviando formulario...');

    const { error: errorFoto } = await supabase.storage
      .from('fotos-carnet')
      .upload(nombreArchivo, fotoAEnviar) 

    if (errorFoto) {
      console.error('Error de Supabase Storage:', errorFoto);
      alert('Error al subir foto carnet. Es posible que el archivo sea demasiado grande.');
      return
    }

    const { data } = supabase.storage
      .from('fotos-carnet')
      .getPublicUrl(nombreArchivo)

    const { error } = await supabase.from('inscriptos').insert([
      {
        ...form,
        foto_url: data.publicUrl
      }
    ])

    if (error) {
      console.error('Error de Supabase Database:', error);
      alert('Error al guardar inscripción en la base de datos.')
      return
    }

    setMensaje('¡Inscripción enviada con éxito!')
    setForm({
      nombre: '',
      apellido: '',
      edad: '',
      categoria: '',
      telefono: ''
    })
    setFoto(null) 
  }
