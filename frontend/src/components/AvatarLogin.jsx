import Avatar from "@mui/material/Avatar";

export default function AvatarLogin({ useAva }) {
  return (
    <Avatar sx={{ width: 75, height: 75, bgcolor: "#9BCCE0" }}>{useAva}</Avatar>
  );
}
