'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

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

    const nombreArchivo = Date.now() + '-' + foto.name

    const { error: errorFoto } = await supabase.storage
      .from('fotos-carnet')
      .upload(nombreArchivo, foto)

    if (errorFoto) {
      alert('Error al subir foto')
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
      alert('Error al guardar inscripción')
      return
    }

    setMensaje('Inscripción enviada con éxito')
    setForm({
      nombre: '',
      apellido: '',
      edad: '',
      categoria: '',
      telefono: ''
    })
  }

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
