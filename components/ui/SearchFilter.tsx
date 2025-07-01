import React from "react";
import { Card, CardBody, Input, Button } from "@heroui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchFilterProps {
  nameFilter: string;
  setNameFilter: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setCurrentPage: (page: number) => void;
  handleSearch: () => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  nameFilter,
  setNameFilter,
  setSearchTerm,
  setCurrentPage,
  handleSearch,
}) => {
  return (
    <Card className="mb-6">
      <CardBody className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-full md:flex-1">
            <Input
              fullWidth
              isClearable
              endContent={
                <Button
                  isIconOnly
                  color="primary"
                  size="sm"
                  onPress={() => handleSearch()}
                >
                  <MagnifyingGlassIcon className="w-4 h-4" />
                </Button>
              }
              label="Buscar por nome"
              placeholder="Digite o nome do produto..."
              size="lg"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              onClear={() => {
                setNameFilter("");
                setSearchTerm("");
                setCurrentPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
          <Button
            className="w-full md:w-auto"
            size="lg"
            variant="flat"
            onPress={() => {
              setNameFilter("");
              setSearchTerm("");
              setCurrentPage(1);
            }}
          >
            Limpar Filtros
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default SearchFilter;
