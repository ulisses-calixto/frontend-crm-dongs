import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent
        className="
          animate-fade-in
          alert-dialog-content-animate 
          rounded-2xl 
          bg-card
        "
      >

        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-red-800">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-md text-gray-600">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              className="hover:bg-gray-100 transition-all rounded-xl px-5"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            
            <Button
              variant="destructive"x
              className="rounded-xl px-5 bg-red-600 hover:bg-red-900 transition-all"
              onClick={onConfirm}
            >
              Confirmar
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
