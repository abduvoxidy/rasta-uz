import { Container } from "@mui/material";
import { BlockPostComponent } from "components/UI/BlockPost/BlockPost";
import cls from "./BlockPost.module.scss";

export default function BlockPost({ banner }) {
  return (
    <main className={cls.main}>
      <Container>
        <BlockPostComponent banner={banner} />
      </Container>
    </main>
  );
}
