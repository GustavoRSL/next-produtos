import { Card, CardBody } from "@heroui/react";

import { title } from "@/components/primitives";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>Dashboard</h1>
        <p className="text-lg text-default-500 mt-4">
          Sistema de gerenciamento de produtos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Card>
          <CardBody className="text-center">
            <h3 className="font-semibold text-lg">Total de Produtos</h3>
            <p className="text-3xl font-bold text-primary mt-2">0</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <h3 className="font-semibold text-lg">Em Estoque</h3>
            <p className="text-3xl font-bold text-success mt-2">0</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <h3 className="font-semibold text-lg">Baixo Estoque</h3>
            <p className="text-3xl font-bold text-warning mt-2">0</p>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
