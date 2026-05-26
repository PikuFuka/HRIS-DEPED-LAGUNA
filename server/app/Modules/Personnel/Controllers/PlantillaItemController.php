<?php

namespace App\Modules\Personnel\Controllers;

use App\Modules\Personnel\Requests\StorePlantillaItemRequest;
use App\Modules\Personnel\Requests\UpdatePlantillaItemRequest;
use App\Modules\Personnel\Resources\PlantillaItemResource;
use App\Modules\Personnel\Models\PlantillaItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PlantillaItemController extends \App\Http\Controllers\Controller
{
    /**
     * Paginated list of all plantilla items with their assigned employee.
     *
     * GET /api/plantilla-items
     */
    public function index(): AnonymousResourceCollection
    {
        $items = PlantillaItem::with('employee')
            ->orderBy('item_number')
            ->paginate(25);

        return PlantillaItemResource::collection($items);
    }

    /**
     * Single plantilla item with employee and full history (newest first).
     *
     * GET /api/plantilla-items/{plantilla_item}
     */
    public function show(PlantillaItem $plantillaItem): PlantillaItemResource
    {
        $plantillaItem->load([
            'employee',
            'itemHistories' => fn ($q) => $q->orderByDesc('start_date'),
        ]);

        return new PlantillaItemResource($plantillaItem);
    }

    /**
     * Create a new plantilla item.
     *
     * POST /api/plantilla-items
     */
    public function store(StorePlantillaItemRequest $request): JsonResponse
    {
        $item = PlantillaItem::create($request->validated());

        return (new PlantillaItemResource($item->load('employee')))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Update an existing plantilla item.
     *
     * PUT /api/plantilla-items/{plantilla_item}
     */
    public function update(UpdatePlantillaItemRequest $request, PlantillaItem $plantillaItem): PlantillaItemResource
    {
        $plantillaItem->update($request->validated());

        return new PlantillaItemResource($plantillaItem->load('employee'));
    }
}
