// aplicación/página.js (tu frontend de Next.js editado)

'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
// 1. IMPORTANTE: Importa la librería de compresión
import imageCompression from 'browser-image-compression';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Page() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    categoria: '',
    telefono: ''
  })

  const [foto, setFoto] = useState(null)
  const [mensaje, setMensaje] = useState('')

  const enviar = async (e) => {
    e.preventDefault()

    if (!foto) {
      alert('Debes subir una foto carnet')
      return
    }

    // --- COMIENZO DE LA COMPRESIÓN DE IMAGEN ---
    
    // Muestra un mensaje de "Comprimiendo..." si lo deseas
    console.log('Comprimiendo imagen...');

    // Opciones de compresión para fotos carnet (no necesitan mucha resolución)
    const opciones = {
      maxSizeMB: 1, // Objetivo: menos de 1MB (muy inferior al límite de 50MB de Supabase)
      maxWidthOrHeight: 1024, // Redimensionar si es necesario
      useWebWorker: true, // Usar un Web Worker para no bloquear el hilo principal
      fileType: 'image/jpeg' // Forzar el formato JPEG para mejor compresión y compatibilidad
    };

    let fotoAEnviar = foto; // Por defecto, enviamos la foto original

    try {
      // Intentar comprimir la imagen
      const fotoComprimida = await imageCompression(foto, opciones);
      console.log(`Imagen comprimida de ${foto.size / 1024 / 1024} MB a ${fotoComprimida.size / 1024 / 1024} MB`);
      fotoAEnviar = fotoComprimida; // Si la compresión tiene éxito, enviamos la comprimida
    } catch (error) {
      // Si la compresión falla, registramos el error pero continuamos con la foto original
      console.error('Fallo en la compresión de imagen:', error);
      console.log('Se intentará subir la foto original.');
    }

    // --- FIN DE LA COMPRESIÓN DE IMAGEN ---

    // Usamos 'fotoAEnviar' (la comprimida si funcionó, la original si no)
    const nombreArchivo = Date.now() + '-' + fotoAEnviar.name

    console.log('Enviando formulario...');

    const { error: errorFoto } = await supabase.storage
      .from('fotos-carnet')
      .upload(nombreArchivo, fotoAEnviar) // Subimos 'fotoAEnviar'

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
    setFoto(null) // Limpiar el estado de la foto
  }

  // --- El resto de tu JSX y estilos se mantienen igual ---

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#000,#1f1f1f,#8b6b00)',
      padding: '30px',
      color: 'white',
      fontFamily: 'Arial'
    }}>
      <div style={{
        maxWidth: '500px',
        margin: 'auto',
        background: 'rgba(255,255,255,0.08)',
        padding: '30px',
        borderRadius: '20px'
      }}>
        <h1 style={{ color: '#ffd700' }}>2do Encuentro Deportivo KIDS</h1>
        <p>21/06/2026 - Club Castelli</p>
        <p>Longchamps, Buenos Aires</p>

        <form onSubmit={enviar}>
          <input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
            style={input}
          />

          <input
            placeholder="Apellido"
            value={form.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
            required
            style={input}
          />

          <input
            placeholder="Edad"
            value={form.edad}
            onChange={(e) => setForm({ ...form, edad: e.target.value })}
            required
            style={input}
          />

          <select
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            required
            style={input}
          >
            <option value="">Seleccionar categoría</option>
            <option>B. punta amarilla</option>
            <option>Amarillo</option>
            <option>A. punta verde</option>
            <option>Verde</option>
            <option>V. punta azul</option>
          </select>

          <input
            placeholder="Teléfono"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            required
            style={input}
          />

          <p>Foto carnet obligatoria:</p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFoto(e.target.files[0])}
            required
            style={{ marginBottom: '15px' }}
          />

          <button style={boton} type="submit">
            Enviar inscripción
          </button>
        </form>

        <p style={{ marginTop: '20px', color: '#00ff88' }}>{mensaje}</p>
      </div>
    </div>
  )
}

const input = {
  width: '100%',
  padding: '12px',
  marginBottom: '12px',
  borderRadius: '10px',
  border: 'none'
}

const boton = {
  width: '100%',
  padding: '14px',
  background: '#ffd700',
  color: 'black',
  border: 'none',
  borderRadius: '12px',
  fontWeight: 'bold',
  cursor: 'pointer'
}
