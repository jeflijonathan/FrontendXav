import useSidebarActions from "../../hooks/useSidebarActions";

type Props = {
  title: string;
  description: string;
};

const HeaderApp = ({ title, description }: Props) => {
  const { handleMenu } = useSidebarActions();
  return (
    <header>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
};
export default HeaderApp;
