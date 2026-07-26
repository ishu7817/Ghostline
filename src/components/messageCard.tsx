"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Message } from "@/models/user.model";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
interface MessageCardProps {
  message: Message, 
  onMessageDelete: (messageId :string)=>void
}
const messageCard = ({message, onMessageDelete}: MessageCardProps) => {
    const handleDeleteConfirm = async ()=>{
   const deletion = await axios.delete(`/api/delete-message/${message._id}`)
   toast(deletion.data.message, {
    description: ""
   })
   onMessageDelete(message._id.toString())
    }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <AlertDialog>
  <AlertDialogTrigger asChild>{<Button variant="destructive" > < X className = "w-5 h-5"/></Button>}
  
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default messageCard;
