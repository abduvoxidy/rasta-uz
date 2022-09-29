import Image from 'next/image'
import styles from './Main.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { Button } from '@mui/material'
import { createPost, getPosts } from 'services'
import { useEffect, useState } from 'react'
import { Counter } from '../Counter/Counter'

export function Main() {
  const { t } = useTranslation('common')
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getPosts({ limit: 10, page: 1 }).then((res) => {
      setPosts(res)
    })
  }, [])

  const addPost = () => {
    createPost(
      JSON.stringify({
        title: 'foo',
        body: 'bar',
        userId: 1,
      })
    ).then((res) => {
      console.log('create')
    })
  }

  return (
    <main className={styles.main}>
      {/* next image
            https://nextjs.org/docs/api-reference/next/image
        */}
      <div className={styles.banner}>
        <div className={styles.text}>{t('greeting')}</div>
        <Image
          src='/images/airplain.jpg'
          objectFit='cover'
          priority={true}
          alt='airplain'
          layout='fill'
        />
      </div>

      <Counter />

      {/* next image domain config
            https://nextjs.org/docs/basic-features/image-optimization#domains
        */}
      <div className={styles.img}>
        <Image
          src='https://test.cdn.rasta.app/rasta/9302ea6c-46d9-4a9c-a9e0-5e9aa9631250'
          width={310}
          height={207}
          alt='airplain'
          objectFit='cover'
          layout='responsive'
        />
      </div>
      <Button size='large' color='primary' onClick={addPost}>
        Create post
      </Button>
      <div>
        {posts.map((item) => (
          <div key={item.id}>{item.title}</div>
        ))}
      </div>
    </main>
  )
}
