import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import { parks } from '../data/parks'
import styles from './MapsPage.module.css'

const PARK_MAPS = {
  'serra-dos-orgaos': {
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14893.84!2d-43.0!3d-22.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9f2b35ef2a5b5f%3A0x1a2b3c4d5e6f7a8b!2sParque%20Nacional%20Serra%20dos%20%C3%93rg%C3%A3os!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr',
    address: 'Av. Rotariana, s/n — Teresópolis, RJ',
    coordinates: '22°27\'S, 43°00\'W',
    phone: '(21) 97896-2463',
  },
  'tres-picos': {
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60000!2d-42.95!3d-22.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sParque%20Estadual%20Tr%C3%AAs%20Picos!5e0!3m2!1spt-BR!2sbr!4v1620000000001!5m2!1spt-BR!2sbr',
    address: 'Estrada Friburgo-Teresópolis — Nova Friburgo, RJ',
    coordinates: '22°25\'S, 42°58\'W',
    phone: '(22) 2543-6200',
  },
  'montanhas-teresopolis': {
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15000!2d-43.02!3d-22.48!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMontanhas%20de%20Teres%C3%B3polis!5e0!3m2!1spt-BR!2sbr!4v1620000000002!5m2!1spt-BR!2sbr',
    address: 'Estrada do Parque s/n — Teresópolis, RJ',
    coordinates: '22°29\'S, 43°01\'W',
    phone: '(21) 2742-3831',
  },
}

export default function MapsPage() {
  const [activeParkId, setActiveParkId] = useState('serra-dos-orgaos')
  const activePark    = parks.find(p => p.id === activeParkId)
  const activeMapData = PARK_MAPS[activeParkId]

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderContent}>
          <h1 className={styles.pageTitle}>Mapas dos parques</h1>
          <p className={styles.pageSubtitle}>Localize os parques e planeje sua visita</p>
        </div>
      </div>

      <main className={styles.main}>
        {/* Seletor de parque */}
        <div className={styles.parkSelector}>
          {parks.map(park => (
            <button
              key={park.id}
              className={`${styles.parkBtn} ${activeParkId === park.id ? styles.parkBtnActive : ''}`}
              onClick={() => setActiveParkId(park.id)}
              aria-pressed={activeParkId === park.id}
            >
              <span className={styles.parkBtnName}>{park.name}</span>
              <span className={styles.parkBtnType}>{park.type}</span>
            </button>
          ))}
        </div>

        {/* Layout mapa + info */}
        <div className={styles.mapLayout}>
          <div className={styles.mapWrapper}>
            <iframe
              src={activeMapData.embedUrl}
              className={styles.mapIframe}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Mapa do ${activePark?.name}`}
              aria-label={`Mapa interativo do ${activePark?.name}`}
            />
          </div>

          <aside className={styles.mapInfo}>
            <h2 className={styles.mapInfoTitle}>{activePark?.name}</h2>
            <p className={styles.mapInfoType}>{activePark?.type}</p>

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>📍</span>
                <div>
                  <p className={styles.infoLabel}>Endereço</p>
                  <p className={styles.infoValue}>{activeMapData.address}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>🌐</span>
                <div>
                  <p className={styles.infoLabel}>Coordenadas</p>
                  <p className={styles.infoValue}>{activeMapData.coordinates}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>🕐</span>
                <div>
                  <p className={styles.infoLabel}>Horário de funcionamento</p>
                  <p className={styles.infoValue}>{activePark?.openingHours}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>📞</span>
                <div>
                  <p className={styles.infoLabel}>Telefone</p>
                  <p className={styles.infoValue}>{activeMapData.phone}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>🎟️</span>
                <div>
                  <p className={styles.infoLabel}>Entrada</p>
                  <p className={styles.infoValue}>{activePark?.entranceFee}</p>
                </div>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(activePark?.name + ' Teresópolis')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.directionsBtn}
            >
              Abrir no Google Maps →
            </a>
          </aside>
        </div>
      </main>
    </div>
  )
}
