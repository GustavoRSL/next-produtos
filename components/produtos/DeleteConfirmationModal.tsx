import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName?: string;
  isLoading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} size="sm" onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex gap-2 items-center text-warning">
          <ExclamationTriangleIcon className="w-6 h-6 text-warning" />
          Confirmar Exclusão
        </ModalHeader>
        <ModalBody>
          <p>
            Tem certeza que deseja excluir{" "}
            {productName ? `"${productName}"` : "este produto"}?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Esta ação não pode ser desfeita.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            className="mr-2"
            color="default"
            variant="flat"
            onPress={onClose}
          >
            Cancelar
          </Button>
          <Button color="danger" isLoading={isLoading} onPress={onConfirm}>
            Excluir
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
