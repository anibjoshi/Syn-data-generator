import React from 'react'
import Image from 'next/image'
import { DatabaseType, SUPPORTED_DATABASES } from '../../utils/constants'
import styles from './DatabaseSelector.module.css'

interface DatabaseSelectorProps {
  database: DatabaseType;
  setDatabase: (db: DatabaseType) => void;
}

export default function DatabaseSelector({ database, setDatabase }: DatabaseSelectorProps) {
  const databases = SUPPORTED_DATABASES.map(db => ({
    name: db,
    logo: `/images/${db.toLowerCase()}-logo.png`
  }));

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        Select your Database
      </label>
      <div className={styles.buttonContainer}>
        {databases.map((db) => (
          <button
            key={db.name}
            onClick={() => setDatabase(db.name)}
            className={`${styles.button} ${database === db.name ? styles.buttonSelected : ''}`}
            title={db.name}
          >
            <Image
              src={db.logo}
              alt={`${db.name} logo`}
              fill
              sizes="(max-width: 160px) 100vw, 160px"
              className={styles.image}
            />
          </button>
        ))}
      </div>
    </div>
  )
}